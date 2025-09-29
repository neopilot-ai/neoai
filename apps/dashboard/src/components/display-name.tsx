"use client";

import { useUserMutation, useUserQuery } from "@/hooks/use-user";
import { useZodForm } from "@/hooks/use-zod-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@neoai/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@neoai/ui/form";
import { Input } from "@neoai/ui/input";
import { SubmitButton } from "@neoai/ui/submit-button";
import { z } from "zod";

const formSchema = z.object({
  fullName: z.string().min(1).max(32).optional(),
});

export function DisplayName() {
  const { data: user } = useUserQuery();
  const updateUserMutation = useUserMutation();

  const form = useZodForm(formSchema, {
    defaultValues: {
      fullName: user?.fullName ?? undefined,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    updateUserMutation.mutate({
      fullName: data?.fullName,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Display Name</CardTitle>
            <CardDescription>
              Please enter your full name, or a display name you are comfortable
              with.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="max-w-[300px]"
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                      maxLength={32}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <div>Please use 32 characters at maximum.</div>
            <SubmitButton
              type="submit"
              disabled={updateUserMutation.isPending}
              isSubmitting={updateUserMutation.isPending}
            >
              Save
            </SubmitButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
