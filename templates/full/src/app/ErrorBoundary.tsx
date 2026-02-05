import type { PropsWithChildren } from "react";
import { Component } from "react";
import { AppDialog } from "@shared";

type ErrorBoundaryState = { hasError: boolean; error?: Error };

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <AppDialog
          open
          title="Something went wrong"
          description={this.state.error?.message ?? "Unexpected error"}
        />
      );
    }
    return this.props.children;
  }
}
