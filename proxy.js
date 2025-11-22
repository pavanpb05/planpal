// middleware.js
export function proxy(request) {
  // No authentication checks, just let request pass through
  void request;
  return;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
