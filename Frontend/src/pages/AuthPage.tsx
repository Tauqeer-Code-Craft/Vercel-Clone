import { Button } from '@/components/ui/button';

export default function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold">Login</h1>
        <Button onClick={() => window.location.href = '/form'}>Mock Login</Button>
      </div>
    </div>
  );
}
