import React from "react";

const page = () => {
  return (
    <div className="relative flex items-center justify-center overflow-hidden bg-background px-6 text-center">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-75 w-75 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sidebar-accent/20 blur-3xl" />
        <div className="absolute right-10 top-10 h-50 w-50 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="max-w-xl">
        <div className="mb-6 inline-flex items-center rounded-full border border-border bg-muted/40 px-4 py-1 text-xs font-medium text-muted-foreground">
          🚧 Under Development
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Coming Soon
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          We're working hard to bring this page to life. Stay tuned — something
          awesome is on the way!
        </p>
        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="h-3 w-3 animate-bounce rounded-full bg-primary" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Thanks for your patience ✨
        </p>
      </div>
    </div>
  );
};

export default page;
