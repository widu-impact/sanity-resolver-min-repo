import { NextResponse } from 'next/server';

export function createErrorResponse({
  message,
  status = 400,
  error,
}: {
  message: string;
  status?: 400 | 401 | 403 | 404 | 500;
  error?: unknown;
}) {
  if (error) {
    console.error({ error });
  }

  return NextResponse.json(
    {
      status: 'error',
      message,
    },
    { status },
  );
}

export function createSuccessResponse(
  data?: Record<string, unknown> | null,
  options?: { status: 200 | 201 | 204 },
) {
  let status = 200;

  if (!data) {
    status = 204;
  }

  if (options?.status) {
    status = options.status;
  }

  if (status === 204) {
    return new Response(null, { status });
  }

  return NextResponse.json(
    { status: 'success', data },
    {
      status,
    },
  );
}
