import React from "react";
import { z } from "zod";
import { TemplateIllustration } from "../components/TemplateIllustration";

import { ILayout } from "./types";
import { OnionIllustration } from "../components/OnionIllustration";

// Define the attendee data structure based on the API response
interface AttendeeData {
  id: string;
  createdAt: string;
  index: number;
  name: string;
  email: string;
}

const onionLayoutConfig = z.object({
  TemplateImage: z.string().url(),
  Title: z.string(),
  Description: z.string(),
  AuthorImage: z.string().nullish(),
  AuthorName: z.string(),
  Category: z.string().nullish(),
  attendeeData: z.string().optional(), // Add field for serialized attendee data
});

type onionLayoutConfig = z.infer<typeof onionLayoutConfig>;

const Component: React.FC<{ config: onionLayoutConfig }> = ({ config }) => {
  console.log({ config });
  const {
    TemplateImage,
    Title,
    Description,
    AuthorImage,
    AuthorName,
    Category,
    attendeeData,
  } = config;

  // Parse attendee data if available
  let attendee: AttendeeData | null = null;
  if (attendeeData) {
    try {
      attendee = JSON.parse(attendeeData) as AttendeeData;
      console.log("Using attendee data:", attendee);
    } catch (e) {
      console.error("Failed to parse attendee data:", e);
    }
  } else {
    console.log("No attendee data provided");
  }

  // Use attendee data if available, otherwise fall back to config values
  const displayName = attendee?.name || Title;
  const displayEmail = attendee?.email || Description;
  const displayId = attendee?.id || "";
  const createdAt = attendee?.createdAt
    ? new Date(attendee.createdAt).toLocaleDateString()
    : "";

  return (
    <div tw="relative flex flex-col w-full h-full">
      <div tw="flex absolute inset-0 w-full h-full">
        <OnionIllustration />
      </div>
      <div tw="flex flex-col justify-between h-full px-20 pt-20 pb-12">
        <div tw="flex justify-between items-center">
          <img src={TemplateImage} alt={Title} height={64} width={64} />
          {attendee && (
            <div tw="bg-white/10 px-6 py-2 rounded-full">
              <p tw="text-xl text-white font-mono">
                Attendee #{attendee.index}
              </p>
            </div>
          )}
        </div>

        <div tw="flex flex-col gap-4">
          <p tw="text-6xl font-bold text-white">{displayName}</p>
          <div tw="flex grow items-end">
            <p tw="mb-12 text-3xl text-gray-500 max-w-[38rem]">
              {displayEmail}
            </p>
          </div>
        </div>

        <div tw="mb-1 flex items-end justify-between">
          <div tw="flex items-center">
            {AuthorImage && (
              <img
                src={AuthorImage}
                alt={AuthorName}
                height={40}
                width={40}
                tw="rounded-full"
              />
            )}
            <p tw="ml-5 text-gray-500 text-[28px]">{AuthorName}</p>
          </div>

          {attendee && (
            <div tw="flex items-center">
              <p tw="text-gray-500 text-sm font-mono">{createdAt}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const onionLayout: ILayout<typeof onionLayoutConfig> = {
  name: "onion",
  config: onionLayoutConfig,
  properties: [
    {
      name: "TemplateImage",
      type: "text",
      default: "https://devicons.railway.app/i/umami-dark.svg",
    },
    {
      name: "Title",
      type: "text",
      default: "OnionDAO",
    },
    {
      name: "Description",
      type: "text",
      default: "Web3 community for builders and creators",
    },
    {
      name: "AuthorImage",
      type: "text",
      default: "https://avatars.githubusercontent.com/u/10681116?v=4",
    },
    {
      name: "AuthorName",
      type: "text",
      default: "OnionDAO",
    },
    {
      name: "Category",
      type: "text",
      default: "Community",
    },
  ],
  Component,
};
