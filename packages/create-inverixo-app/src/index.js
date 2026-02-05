#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import prompts from "prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_ROOT = path.resolve(__dirname, "../../templates/full");

const copyDir = async (source, destination) => {
  await fs.promises.cp(source, destination, { recursive: true });
};

const removePath = async (target) => {
  if (fs.existsSync(target)) {
    await fs.promises.rm(target, { recursive: true, force: true });
  }
};

const readFile = async (target) => fs.promises.readFile(target, "utf8");
const writeFile = async (target, content) => fs.promises.writeFile(target, content, "utf8");

const updatePackageJson = async (projectRoot, updater) => {
  const packageJsonPath = path.join(projectRoot, "package.json");
  const content = JSON.parse(await readFile(packageJsonPath));
  const updated = updater(content);
  await writeFile(packageJsonPath, JSON.stringify(updated, null, 2));
};

const removeDependencies = (pkg, deps) => {
  for (const dep of deps) {
    if (pkg.dependencies?.[dep]) delete pkg.dependencies[dep];
    if (pkg.devDependencies?.[dep]) delete pkg.devDependencies[dep];
  }
};

const updateModulesIndex = async (projectRoot, features) => {
  const exports = ["./auth", "./access", "./tenants", "./forms", "./users"]
    .filter((entry) => {
      if (entry === "./auth") return features.auth !== "none";
      if (entry === "./access") return features.rbac;
      if (entry === "./tenants") return features.multiTenant;
      if (entry === "./forms") return features.forms;
      if (entry === "./users") return true;
      return false;
    })
    .map((entry) => `export * from \"${entry}\";`)
    .join("\n");

  await writeFile(path.join(projectRoot, "src/modules/index.ts"), `${exports}\n`);
};

const updateAppProviders = async (projectRoot, features) => {
  const providerPath = path.join(projectRoot, "src/app/AppProviders.tsx");
  if (!fs.existsSync(providerPath)) return;

  const baseImports = [
    "import { CssBaseline, ThemeProvider } from \"@mui/material\";",
    "import type { PropsWithChildren } from \"react\";"
  ];
  if (!features.multiTenant) {
    baseImports.push("import { createTheme } from \"@mui/material/styles\";");
  }
  const additionalImports = [];

  if (features.multiTenant) {
    additionalImports.push("import { TenantProvider, useTenant } from \"@modules\";");
  }
  if (features.auth !== "none") {
    additionalImports.push("import { AuthProvider } from \"@modules\";");
  }
  if (features.rbac) {
    additionalImports.push("import { AccessProvider } from \"@modules\";");
  }
  if (features.componentKit) {
    additionalImports.push("import { AppToastProvider } from \"@shared\";");
  }

  const themeProviderWrapper = features.multiTenant
    ? `const TenantThemeProvider = ({ children }: PropsWithChildren) => {\n  const { theme } = useTenant();\n  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;\n};`
    : `const TenantThemeProvider = ({ children }: PropsWithChildren) => (\n  <ThemeProvider theme={createTheme()}>{children}</ThemeProvider>\n);`;

  const wrap = (content, wrapper) => `  <${wrapper}>\n${content}\n  </${wrapper}>`;

  let body = "{children}";
  if (features.componentKit) {
    body = wrap(body, "AppToastProvider");
  }
  body = `  <TenantThemeProvider>\n    <CssBaseline />\n${body}\n  </TenantThemeProvider>`;

  if (features.rbac) {
    body = wrap(body, "AccessProvider");
  }
  if (features.auth !== "none") {
    body = wrap(body, "AuthProvider");
  }
  if (features.multiTenant) {
    body = wrap(body, "TenantProvider");
  }

  const content = `${baseImports.join("\n")}\n${additionalImports.join("\n")}
${themeProviderWrapper}

export const AppProviders = ({ children }: PropsWithChildren) => (\n${body}\n);\n`;

  await writeFile(providerPath, content);
};

const updateAppRouter = async (projectRoot, features) => {
  const routerPath = path.join(projectRoot, "src/app/AppRouter.tsx");
  if (!fs.existsSync(routerPath)) return;

  const layoutImport = features.multiTenant
    ? "import { TenantLayout } from \"@tenants\";"
    : "import { DefaultLayout } from \"@app\";";

  const protectedWrapper = features.auth !== "none"
    ? `<ProtectedRoute>\n        ${features.multiTenant ? "<TenantLayout />" : "<DefaultLayout />"}\n      </ProtectedRoute>`
    : features.multiTenant
      ? "<TenantLayout />"
      : "<DefaultLayout />";

  const authImports = features.auth !== "none" ? "import { AuthRoutes, ProtectedRoute } from \"@modules\";" : "";

  const authRoutes = features.auth !== "none" ? ",\n  ...AuthRoutes" : "";

  const content = `import { createBrowserRouter, Navigate, RouterProvider } from \"react-router-dom\";\n${authImports}\n${layoutImport}\nimport { UsersRoutes } from \"@modules\";\n\nconst router = createBrowserRouter([\n  {\n    path: \"/\",\n    element: (\n      ${protectedWrapper}\n    ),\n    children: [\n      { path: \"/\", element: <Navigate to=\"/users\" replace /> },\n      ...UsersRoutes\n    ]\n  }${authRoutes}\n]);\n\nexport const AppRouter = () => <RouterProvider router={router} />;\n`;

  await writeFile(routerPath, content);
};

const updateAuthRoutes = async (projectRoot, features) => {
  if (features.auth === "none") return;
  const routesPath = path.join(projectRoot, "src/modules/auth/routes.tsx");
  if (!fs.existsSync(routesPath)) return;

  const loginRoutes = [];
  loginRoutes.push({ path: "/login", component: "LoginPage" });
  if (features.loginMethods !== "password") {
    loginRoutes.push({ path: "/login-otp", component: "OtpLoginPage" });
  }
  if (features.registerEnabled) {
    loginRoutes.push({ path: "/register", component: "RegisterPage" });
  }
  if (features.forgotEnabled) {
    loginRoutes.push({ path: "/forgot-password", component: "ForgotPasswordPage" });
  }
  if (features.resetEnabled) {
    loginRoutes.push({ path: "/reset-password", component: "ResetPasswordPage" });
  }
  loginRoutes.push({ path: "/logout", component: "LogoutPage", guest: false });

  const imports = [
    "import type { RouteObject } from \"react-router-dom\";",
    "import { GuestRoute } from \"@modules\";",
    "import {"
  ];
  const pages = new Set(["LoginPage", "LogoutPage"]);
  for (const route of loginRoutes) {
    pages.add(route.component);
  }
  imports.push(`  ${Array.from(pages).sort().join(",\n  ")}`);
  imports.push("} from \"@modules\";\n");

  const routes = loginRoutes
    .map((route) => {
      if (route.component === "LogoutPage") {
        return `  {\n    path: \"${route.path}\",\n    element: <${route.component} />\n  }`;
      }
      return `  {\n    path: \"${route.path}\",\n    element: (\n      <GuestRoute>\n        <${route.component} />\n      </GuestRoute>\n    )\n  }`;
    })
    .join(",\n");

  const content = `${imports.join("\n")}\nexport const AuthRoutes: RouteObject[] = [\n${routes}\n];\n`;
  await writeFile(routesPath, content);

  const pagesDir = path.join(projectRoot, "src/modules/auth/pages");
  const keep = new Set(pages);
  const files = await fs.promises.readdir(pagesDir);
  await Promise.all(
    files.map(async (file) => {
      const name = file.replace(".tsx", "");
      if (!keep.has(name)) {
        await removePath(path.join(pagesDir, file));
      }
    })
  );
};

const removeFeature = async (projectRoot, feature) => {
  switch (feature) {
    case "auth":
      await removePath(path.join(projectRoot, "src/modules/auth"));
      break;
    case "access":
      await removePath(path.join(projectRoot, "src/modules/access"));
      break;
    case "tenants":
      await removePath(path.join(projectRoot, "src/modules/tenants"));
      await removePath(path.join(projectRoot, "src/tenants"));
      break;
    case "forms":
      await removePath(path.join(projectRoot, "src/modules/forms"));
      break;
    case "tests":
      await removePath(path.join(projectRoot, "src/tests"));
      await removePath(path.join(projectRoot, "vitest.config.ts"));
      await removePath(path.join(projectRoot, "scripts/coverage-changed.mjs"));
      break;
    case "husky":
      await removePath(path.join(projectRoot, ".husky"));
      await removePath(path.join(projectRoot, "commitlint.config.cjs"));
      break;
    case "componentKit":
      await removePath(path.join(projectRoot, "src/shared/components"));
      await removePath(path.join(projectRoot, "src/shared/hooks"));
      break;
    default:
      break;
  }
};

const updateSharedIndex = async (projectRoot, features) => {
  const sharedIndexPath = path.join(projectRoot, "src/shared/index.ts");
  if (!fs.existsSync(sharedIndexPath)) return;
  const exports = [
    "export { httpClient } from \"./api/http\";",
    "export { createAppTheme } from \"./theme/createAppTheme\";",
    "export { asyncSleep } from \"./utils/asyncSleep\";",
    "export type { HttpRequest, HttpResponse, Interceptor } from \"./types/http\";"
  ];
  if (features.componentKit) {
    exports.unshift(
      "export { AppButton } from \"./components/AppButton\";",
      "export { AppDialog } from \"./components/AppDialog\";",
      "export { AppInput } from \"./components/AppInput\";",
      "export { AppToastProvider, useToast } from \"./components/AppToast\";",
      "export { ConfirmDialog } from \"./components/ConfirmDialog\";",
      "export { DataTable } from \"./components/DataTable\";",
      "export { useToggle } from \"./hooks/useToggle\";"
    );
  }
  await writeFile(sharedIndexPath, exports.join("\n") + "\n");
};

const replaceSharedComponentsUsage = async (projectRoot) => {
  const replacements = [
    {
      file: "src/app/ErrorBoundary.tsx",
      content: (text) =>
        text
          .replace("import { AppDialog } from \"@shared\";", "import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from \"@mui/material\";")
          .replace(
            /<AppDialog([\s\S]*?)\/\/>/g,
            "<Dialog open><DialogTitle>Something went wrong</DialogTitle><DialogContent>{this.state.error?.message ?? \"Unexpected error\"}</DialogContent><DialogActions><Button onClick={() => null}>Close</Button></DialogActions></Dialog>"
          )
    }
  ];

  for (const item of replacements) {
    const target = path.join(projectRoot, item.file);
    if (!fs.existsSync(target)) continue;
    const content = await readFile(target);
    await writeFile(target, item.content(content));
  }
};

const updatePackageScripts = async (projectRoot, features) => {
  await updatePackageJson(projectRoot, (pkg) => {
    if (!features.tests) {
      delete pkg.scripts.test;
      delete pkg.scripts.coverage;
      delete pkg.scripts["coverage:changed"];
    }
    if (!features.commitHooks) {
      delete pkg["lint-staged"];
      delete pkg.scripts.prepare;
    }
    return pkg;
  });
};

const updateDependencies = async (projectRoot, features) => {
  await updatePackageJson(projectRoot, (pkg) => {
    if (!features.forms) {
      removeDependencies(pkg, ["react-hook-form", "zod", "@hookform/resolvers"]);
    }
    if (!features.tests) {
      removeDependencies(pkg, [
        "vitest",
        "@vitest/coverage-v8",
        "@testing-library/react",
        "@testing-library/jest-dom",
        "@testing-library/user-event",
        "jsdom"
      ]);
    }
    if (!features.commitHooks) {
      removeDependencies(pkg, ["husky", "lint-staged", "commitlint", "@commitlint/config-conventional"]);
    }
    return pkg;
  });
};

const updateAuthIndex = async (projectRoot, features) => {
  if (features.auth === "none") return;
  const indexPath = path.join(projectRoot, "src/modules/auth/index.ts");
  if (!fs.existsSync(indexPath)) return;
  const exports = [
    "export { authApi } from \"./api/authApi\";",
    "export { AuthProvider, useAuth } from \"./context/AuthContext\";",
    "export { ProtectedRoute } from \"./components/ProtectedRoute\";",
    "export { GuestRoute } from \"./components/GuestRoute\";",
    "export { AuthRoutes } from \"./routes\";",
    "export { LoginPage } from \"./pages/LoginPage\";",
    "export { LogoutPage } from \"./pages/LogoutPage\";",
    "export type { AuthUser, AuthState } from \"./types/auth\";"
  ];

  if (features.loginMethods !== "password") {
    exports.splice(6, 0, "export { OtpLoginPage } from \"./pages/OtpLoginPage\";");
  }
  if (features.registerEnabled) {
    exports.push("export { RegisterPage } from \"./pages/RegisterPage\";");
  }
  if (features.forgotEnabled) {
    exports.push("export { ForgotPasswordPage } from \"./pages/ForgotPasswordPage\";");
  }
  if (features.resetEnabled) {
    exports.push("export { ResetPasswordPage } from \"./pages/ResetPasswordPage\";");
  }

  await writeFile(indexPath, exports.join("\n") + "\n");
};

const updateLoginPageForSingleTenant = async (projectRoot, features) => {
  if (features.multiTenant || features.auth === "none") return;
  const loginPath = path.join(projectRoot, "src/modules/auth/pages/LoginPage.tsx");
  if (!fs.existsSync(loginPath)) return;
  const otpEnabled = features.loginMethods !== "password";
  const registerEnabled = features.registerEnabled;
  const content = `import { useState } from \"react\";
import { Link } from \"react-router-dom\";
import { AppButton, AppInput, useToast } from \"@shared\";
import { useAuth } from \"@modules\";
import { Box, Stack, Typography } from \"@mui/material\";

export const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState(\"\");
  const [password, setPassword] = useState(\"\");

  const onSubmit = async () => {
    try {
      await login(email, password);
      showToast({ message: \"Welcome back\", severity: \"success\" });
    } catch (error) {
      const message = error instanceof Error ? error.message : \"Login failed\";
      showToast({ message, severity: \"error\" });
    }
  };

  return (
    <Box className=\"min-h-screen flex items-center justify-center p-6\">
      <Stack spacing={2} className=\"w-full max-w-md\">
        <Typography variant=\"h4\">Inverixo Login</Typography>
        <AppInput label=\"Email\" value={email} onChange={(event) => setEmail(event.target.value)} />
        <AppInput
          label=\"Password\"
          type=\"password\"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <AppButton onClick={onSubmit}>Login</AppButton>
        <Stack direction=\"row\" spacing={2}>
          <Link to=\"/forgot-password\">Forgot Password</Link>
          ${registerEnabled ? "<Link to=\"/register\">Register</Link>" : ""}
          ${otpEnabled ? "<Link to=\"/login-otp\">Login via OTP</Link>" : ""}
        </Stack>
      </Stack>
    </Box>
  );
};
`;
  await writeFile(loginPath, content);
};

const updateTestsForFeatures = async (projectRoot, features) => {
  if (!features.tests) return;
  const testsRoot = path.join(projectRoot, "src/tests");
  if (!fs.existsSync(testsRoot)) return;
  if (!features.rbac) {
    await removePath(path.join(testsRoot, "access.test.ts"));
  }
  if (!features.multiTenant) {
    await removePath(path.join(testsRoot, "tenantResolver.test.ts"));
  }
  if (!features.forms) {
    await removePath(path.join(testsRoot, "formRenderer.test.tsx"));
  }
};

const updateComponentKitUsage = async (projectRoot, features) => {
  if (features.componentKit) return;

  const files = [
    "src/modules/auth/pages/LoginPage.tsx",
    "src/modules/auth/pages/OtpLoginPage.tsx",
    "src/modules/auth/pages/RegisterPage.tsx",
    "src/modules/auth/pages/ForgotPasswordPage.tsx",
    "src/modules/auth/pages/ResetPasswordPage.tsx",
    "src/modules/users/pages/UsersListPage.tsx",
    "src/modules/users/pages/InviteUserPage.tsx"
  ];

  for (const file of files) {
    const target = path.join(projectRoot, file);
    if (!fs.existsSync(target)) continue;
    let content = await readFile(target);
    content = content
      .replace(/import \{([^}]*?)\} from \"@shared\";\n/g, "")
      .replace(/AppButton/g, "Button")
      .replace(/AppInput/g, "TextField")
      .replace(/DataTable/g, "Table")
      .replace(/useToast/g, "useToast");
    content = content.replace(
      /const \{ showToast \} = useToast\(\);/g,
      "const showToast = ({ message }) => console.log(message);"
    );
    if (file.includes("UsersListPage")) {
      content = content.replace(
        /<Table[\s\S]*?<\/Table>/g,
        "<Table><TableBody>{rows.map((row) => (<TableRow key={row.email}><TableCell>{row.name}</TableCell><TableCell>{row.email}</TableCell></TableRow>))}</TableBody></Table>"
      );
      content = content.replace(
        /import \{ Box, Stack, Typography \} from \"@mui\/material\";/,
        "import { Box, Stack, Typography, Button, Table, TableBody, TableCell, TableRow } from \"@mui/material\";"
      );
    } else {
      content = content.replace(
        /import \{ Box, Stack, Typography \} from \"@mui\/material\";/,
        "import { Box, Stack, Typography, Button, TextField } from \"@mui/material\";"
      );
    }
    await writeFile(target, content);
  }

  await replaceSharedComponentsUsage(projectRoot);
};

const updateAppProvidersForComponentKit = async (projectRoot, features) => {
  if (features.componentKit) return;
  const providerPath = path.join(projectRoot, "src/app/AppProviders.tsx");
  if (!fs.existsSync(providerPath)) return;
  const content = await readFile(providerPath);
  const updated = content
    .replace(/import \{ AppToastProvider \} from \"@shared\";\n/, "")
    .replace(/<AppToastProvider>\n/, "")
    .replace(/\n  <\/AppToastProvider>/, "");
  await writeFile(providerPath, updated);
};

const main = async () => {
  const response = await prompts([
    {
      type: "text",
      name: "projectName",
      message: "Project name",
      initial: "inverixo-app"
    },
    {
      type: "toggle",
      name: "multiTenant",
      message: "Include multi-tenant support?",
      initial: true,
      active: "yes",
      inactive: "no"
    },
    {
      type: (prev) => (prev ? "select" : null),
      name: "tenantDetection",
      message: "Tenant detection mode",
      choices: [
        { title: "subdomain", value: "subdomain" },
        { title: "custom domain", value: "custom" },
        { title: "path", value: "path" }
      ]
    },
    {
      type: "select",
      name: "auth",
      message: "Include auth?",
      choices: [
        { title: "none", value: "none" },
        { title: "basic", value: "basic" },
        { title: "full", value: "full" }
      ],
      initial: 2
    },
    {
      type: (prev) => (prev === "none" ? null : "select"),
      name: "loginMethods",
      message: "Login methods",
      choices: [
        { title: "password", value: "password" },
        { title: "otp", value: "otp" },
        { title: "both", value: "both" }
      ],
      initial: 2
    },
    {
      type: (prev, values) => (values.auth === "none" ? null : "toggle"),
      name: "registerEnabled",
      message: "Include register?",
      initial: true,
      active: "yes",
      inactive: "no"
    },
    {
      type: (prev, values) => (values.auth === "none" ? null : "toggle"),
      name: "forgotEnabled",
      message: "Include forgot password?",
      initial: true,
      active: "yes",
      inactive: "no"
    },
    {
      type: (prev, values) => (values.auth === "none" ? null : "toggle"),
      name: "resetEnabled",
      message: "Include reset password?",
      initial: true,
      active: "yes",
      inactive: "no"
    },
    {
      type: "toggle",
      name: "rbac",
      message: "Include RBAC?",
      initial: true,
      active: "yes",
      inactive: "no"
    },
    {
      type: "toggle",
      name: "forms",
      message: "Include form builder?",
      initial: true,
      active: "yes",
      inactive: "no"
    },
    {
      type: "toggle",
      name: "componentKit",
      message: "Include component kit?",
      initial: true,
      active: "yes",
      inactive: "no"
    },
    {
      type: "toggle",
      name: "tests",
      message: "Include tests + coverage?",
      initial: true,
      active: "yes",
      inactive: "no"
    },
    {
      type: "toggle",
      name: "commitHooks",
      message: "Include commit hooks + conventional commits?",
      initial: true,
      active: "yes",
      inactive: "no"
    }
  ]);

  if (!response.projectName) return;

  if (response.auth === "none") {
    response.rbac = false;
  }

  const projectRoot = path.resolve(process.cwd(), response.projectName);
  await copyDir(TEMPLATE_ROOT, projectRoot);

  const features = {
    multiTenant: response.multiTenant,
    auth: response.auth,
    loginMethods: response.loginMethods === "both" ? "both" : response.loginMethods ?? "password",
    registerEnabled: response.registerEnabled ?? false,
    forgotEnabled: response.forgotEnabled ?? false,
    resetEnabled: response.resetEnabled ?? false,
    rbac: response.rbac,
    forms: response.forms,
    componentKit: response.componentKit,
    tests: response.tests,
    commitHooks: response.commitHooks
  };

  if (!features.multiTenant) {
    await removeFeature(projectRoot, "tenants");
  }
  if (features.auth === "none") {
    await removeFeature(projectRoot, "auth");
  }
  if (!features.rbac) {
    await removeFeature(projectRoot, "access");
  }
  if (!features.forms) {
    await removeFeature(projectRoot, "forms");
  }
  if (!features.tests) {
    await removeFeature(projectRoot, "tests");
  }
  if (!features.commitHooks) {
    await removeFeature(projectRoot, "husky");
  }
  if (!features.componentKit) {
    await removeFeature(projectRoot, "componentKit");
  }

  await updateModulesIndex(projectRoot, features);
  await updateSharedIndex(projectRoot, features);
  await updateAppProviders(projectRoot, features);
  await updateAppRouter(projectRoot, features);

  if (features.auth !== "none") {
    await updateAuthRoutes(projectRoot, features);
    await updateAuthIndex(projectRoot, features);
  }
  await updateLoginPageForSingleTenant(projectRoot, features);
  await updateTestsForFeatures(projectRoot, features);

  await updateComponentKitUsage(projectRoot, features);
  await updateAppProvidersForComponentKit(projectRoot, features);
  await updatePackageScripts(projectRoot, features);
  await updateDependencies(projectRoot, features);

  if (!features.componentKit) {
    await updatePackageJson(projectRoot, (pkg) => {
      removeDependencies(pkg, ["@tanstack/react-table"]);
      return pkg;
    });
  }

  execSync("npm install", { cwd: projectRoot, stdio: "inherit" });
  execSync("git init", { cwd: projectRoot, stdio: "inherit" });

  console.log(`\nProject ready at ${projectRoot}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
