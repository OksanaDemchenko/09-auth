'use client';

export default function Error({ error }: { error: Error }) {
  return <p>Failed to load profile data: {error.message}</p>;
}
