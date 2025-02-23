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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ad Blocker Detected</DialogTitle>
          <DialogDescription>
            We noticed you&apos;re using an ad blocker. Our website is 100% free, and we rely on ads to keep it that way.
            Please disable your ad blocker to continue using our services.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <p className="text-sm text-gray-500">
            After disabling your ad blocker, click the button below to reload the page.
          </p>
          <Button onClick={handleReload}>
            I&apos;ve Disabled My Ad Blocker - Reload Page
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}