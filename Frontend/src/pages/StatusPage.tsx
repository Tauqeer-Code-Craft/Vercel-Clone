import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function StatusPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Build Status</h2>
        <Badge variant="outline">In Progress</Badge>
      </div>

      <Textarea
        readOnly
        className="h-60"
        value={`[LOG] Cloning repo...\n[LOG] Running build...\n[LOG] Almost done...`}
      />

      <div className="text-right">
        <Button asChild>
          <a href="https://your-deployed-project-url.com" target="_blank" rel="noopener noreferrer">
            Visit Project
          </a>
        </Button>
      </div>
    </div>
  );
}
