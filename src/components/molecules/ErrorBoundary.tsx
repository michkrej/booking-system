import type { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

const handleGoHome = () => {
  window.location.href = "/"; // ensures full reload
};

const FallbackComponent = ({ error }: { error: unknown }) => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted">
      <Card className="w-full max-w-2xl">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <CardTitle>Något gick fel</CardTitle>
          <CardDescription>
            Hoppsan! Det var visst ett problem med hemsidan.
          </CardDescription>

          <pre className="bg-muted/20 mt-2 max-h-60 w-full overflow-auto rounded p-2 text-left text-xs">
            {import.meta.env.DEV ? (
              <>
                <p>
                  Error: {error instanceof Error ? error.message : "Okänf fel"}
                </p>
                <p>
                  {error instanceof Error &&
                    error.stack &&
                    `\n\n${error.stack}`}
                </p>
              </>
            ) : (
              <p>
                Error: {error instanceof Error ? error.message : "Okänt fel"}
              </p>
            )}
          </pre>

          <div className="mt-4 flex gap-2">
            <Button onClick={handleGoHome}>Återvänd hem</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: ReactNode;
}

export const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  return (
    <ReactErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </ReactErrorBoundary>
  );
};
