"use client";

import { useUserMutation, useUserQuery } from "@/hooks/use-user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@neoai/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@neoai/ui/select";

export function DateFormatSettings() {
  const { data: user } = useUserQuery();
  const updateUserMutation = useUserMutation();

  return (
    <Card className="flex justify-between items-center">
      <CardHeader>
        <CardTitle>Date Display Format</CardTitle>
        <CardDescription>
          Select the format used to display dates throughout the app.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Select
          defaultValue={user?.dateFormat ?? undefined}
          onValueChange={(value) => {
            updateUserMutation.mutate({
              dateFormat: value as
                | "dd/MM/yyyy"
                | "MM/dd/yyyy"
                | "yyyy-MM-dd"
                | "dd.MM.yyyy",
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Date format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
            <SelectItem value="MM/dd/yyyy">MM/dd/yyyy</SelectItem>
            <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
            <SelectItem value="dd.MM.yyyy">dd.MM.yyyy</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
