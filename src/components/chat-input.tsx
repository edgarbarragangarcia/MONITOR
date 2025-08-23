'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendHorizonal, CornerDownLeft } from 'lucide-react';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

type FormValues = z.infer<typeof formSchema>;

type ChatInputProps = {
  onSendMessage: (message: string) => void;
};

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onSendMessage(data.message);
    form.reset();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="p-4 border-t bg-background/80">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <Textarea
                      {...field}
                      placeholder="Type your message..."
                      className="pr-20"
                      rows={1}
                      onKeyDown={handleKeyDown}
                    />
                    <div className="absolute right-2 bottom-2 flex items-center text-xs text-muted-foreground">
                       <CornerDownLeft className="h-3 w-3 mr-1" /> Shift for new line
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" size="icon" disabled={form.formState.isSubmitting}>
            <SendHorizonal />
          </Button>
        </form>
      </Form>
    </div>
  );
}
