import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  /** Optional custom fallback. Defaults to the standard "section unavailable" card. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render/lifecycle errors from anything below it and shows a fallback
 * instead of unmounting the whole React tree (which is what turns a single
 * failed page into a blank-screen "the store is down" experience).
 *
 * Place this AROUND the routed page content but INSIDE the layout, so the
 * header, footer, and cart stay operational even when one page throws.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log for observability; never surface raw error details to the shopper.
    console.error("[error-boundary] caught render error:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <section className="container-narrow py-24 md:py-32 text-center">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="font-serif text-3xl md:text-5xl mt-4">
          This page is having a moment.
        </h1>
        <p className="mt-5 max-w-md mx-auto text-muted-foreground leading-relaxed">
          We couldn&rsquo;t load this section just now. The rest of the store is still
          available — please try again in a moment.
        </p>
        <Button
          onClick={this.handleReset}
          className="mt-8 rounded-none h-12 px-8 tracking-[0.16em] uppercase text-[12px]"
        >
          Try again
        </Button>
      </section>
    );
  }
}
