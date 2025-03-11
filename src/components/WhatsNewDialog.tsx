import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const APP_VERSION = '1.1.0';
const STORAGE_KEY = 'whatsNewVersion';

const WhatsNewDialog: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const lastSeenVersion = localStorage.getItem(STORAGE_KEY);
    if (lastSeenVersion !== APP_VERSION) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
   
    setOpen(false);
  };

  const handleRead = () => {
    setOpen(false);

    localStorage.setItem(STORAGE_KEY, APP_VERSION);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
      onPointerDownOutside={(e) => {
        e.preventDefault();
      }}
      >
        <DialogHeader>
          <DialogTitle>What&apos;s New in Version {APP_VERSION}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <ul className="list-disc pl-6 space-y-2">
            <li>NO MORE ADS ^^</li>
            <li>Ad Blockers are now allowed.</li>
            <li>Bug fixes and improvements</li>
          </ul>
        </div>
        <DialogFooter>
          <Button onClick={handleRead}>Got it!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsNewDialog;