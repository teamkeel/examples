import * as z from 'zod';
import { isBrowser, isNode } from 'browser-or-node';
import fs from 'fs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import React, { useCallback, useEffect, useState } from 'react';
import { useUser } from '@/lib/userContext';
import { useKeel } from '@/app/layout';

export const TeamDetailsForm = () => {
  const { token, userId } = useUser();
  const keel = useKeel();
  const [placeholder, setPlaceholder] = useState('');
  keel.client.setHeader('Authorization', 'Bearer ' + token);
  keel.client.setToken(token as string);

  const formSchema = z.object({
    teamName: z.string().min(2).max(50),
    logo: z.any(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: '',
      logo: null,
    },
  });

  function convertFileToBase64(file: File | string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Client-side: Using FileReader API
      if (isBrowser) {
        const reader = new FileReader();
        reader.readAsDataURL(file as File);
        reader.onloadend = () => {
          if (reader.error) {
            reject(reader.error);
          } else {
            resolve(reader.result as string);
          }
        };
        reader.onerror = (error) => reject(error);
      }
      // Server-side: Using Node.js fs module
      else if (isNode) {
        fs.readFile(file as string, 'base64', (err, data) => {
          if (err) {
            reject(err);
          } else {
            // Prefix with data URI format for consistency with FileReader API
            const base64Data = `data:${getMimeType(
              file as string
            )};base64,${data}`;
            resolve(base64Data);
          }
        });
      }
    });
  }

  // Helper function to determine MIME type based on file extension (for server-side)
  function getMimeType(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      // Add other file types as needed
      default:
        return 'application/octet-stream';
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imagePath = await uploadImageToKeel(file, userId as string);
        console.log('Uploaded Image Path:', imagePath);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }
  async function uploadImageToKeel(
    file: File,
    userId: string
  ): Promise<string> {
    // Convert the file to base64
    const base64Image = await convertFileToBase64(file);
    console.log(base64Image);
    // Send the base64 image data to the Keel function
    const response = await keel.api.mutations.uploadImageToCloudinary({
      base64Image,
      userId: userId,
    });

    const data = await response.data;
    if (!data || !data.path) {
      throw new Error('Failed to get the image path from the Keel function.');
    }
    const imagePath = data.path;

    console.log(imagePath);
    return imagePath;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const user = await keel.api.queries.me();
      const userId = (await user.data?.id) || [];
      if (!userId) {
        alert('No user found in the database. Please add a user first.');
        return;
      }

      if (values.logo) {
        const imagepath = await uploadImageToKeel(
          values.logo[0],
          userId as string
        );
        console.log('Uploaded Image Path:', imagepath);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const fetchFirstTeamName = useCallback(async () => {
    const response = await keel.api.queries.listTeams();
    return response.data?.results[0].name;
  }, [keel.api.queries]);

  useEffect(() => {
    const getPlaceholder = async () => {
      const name = await fetchFirstTeamName();
      setPlaceholder(name as string);
    };

    getPlaceholder();
  }, [fetchFirstTeamName]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="teamName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team name</FormLabel>
              <FormControl>
                <Input placeholder={placeholder} {...field} />
              </FormControl>
              {/* <FormDescription>
					This is your public display name.
				  </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Me Inc"
                  className="text-white"
                  type="file"
                  {...field}
                  onChange={handleFileChange}
                />
              </FormControl>
              {/* <FormDescription>
					This is your public display name.
				  </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant={'secondary'} type="submit">
          Update
        </Button>
      </form>
    </Form>
  );
};
