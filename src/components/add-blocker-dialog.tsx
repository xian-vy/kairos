import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AdBlockerDialogProps {
  isOpen: boolean;
}

export function AdBlockerDialog({ isOpen }: AdBlockerDialogProps) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="w-11/12 sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>We Understand You Use an Ad Blocker</DialogTitle>
          <DialogDescription>
            We respect your choice to use an ad blocker for your online safety. However, our website relies on 
            ads to keep our services free for everyone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <div className="space-y-3 text-sm text-gray-600">
            <p>To continue using our services, you can:</p>
            <ol className="list-decimal ml-5 space-y-2">
              <li><strong>Whitelist our website</strong> (recommended):
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>Click on your ad blocker icon in the browser toolbar</li>
                  <li>Look for &quot;Don&apos;t run on this site&quot; or &quot;Whitelist this site&quot;</li>
                  <li>Refresh the page after whitelisting</li>
                </ul>
              </li>
              <li><strong>Temporarily pause</strong> your ad blocker for this session</li>
            </ol>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end items-center mt-2">
            <Button variant="outline" onClick={handleReload}>
              I&apos;ll Keep My Ad Blocker On
            </Button>
            <Button onClick={handleReload}>
              I&apos;ve Whitelisted - Reload Page
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}