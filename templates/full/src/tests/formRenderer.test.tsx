import { render, screen, fireEvent } from "@testing-library/react";
import { z } from "zod";
import { FormRenderer } from "@modules";
import type { FormSchema } from "@modules";

describe("FormRenderer", () => {
  it("renders and submits", () => {
    const schema: FormSchema = {
      validationSchema: z.object({ name: z.string().min(2) }),
      sections: [
        { fields: [{ name: "name", label: "Name", type: "text" }] }
      ]
    };
    const onSubmit = vi.fn();

    render(<FormRenderer schema={schema} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Lina" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(onSubmit).toHaveBeenCalledWith({ name: "Lina" });
  });
});
