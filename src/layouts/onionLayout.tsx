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

  console.log({ displayName, displayEmail, displayId, createdAt });

  const baseUrl = process.env.PUBLIC_URL || "http://localhost:3001";

  return (
    <div tw="relative flex flex-col w-full h-full">
      <div tw="flex absolute inset-0 w-full h-full">
        <OnionIllustration />
      </div>
      <div tw="flex relative  w-full h-full">
        <div tw="flex absolute top-[142px] left-[110px]">
          <img
            src={`${baseUrl}/onion.png`}
            alt={AuthorName}
            height={150}
            width={150}
            tw="rounded-full"
          />
        </div>

        <div tw="flex absolute top-[260px] right-[255px] text-black text-end w-[200px]">
          <p tw="text-6xl">
            {(attendee?.index ?? 0).toString().padStart(4, "0")}
          </p>
        </div>
        <div tw="flex absolute top-[390px] right-[255px] text-black text-end w-[200px]">
          <p tw="text-4xl">{displayName}</p>
        </div>
        <div tw="flex absolute bottom-[95px] right-[73px]">
          <img
            src={`https://api.dicebear.com/9.x/identicon/png?seed=${
              attendee?.index ?? 0
            }`}
            alt={AuthorName}
            height={87}
            width={87}
            tw="rounded-full"
          />
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
    {
      name: "attendeeData",
      type: "text",
      default: "hi", // Empty default
    },
  ],
  Component,
};
