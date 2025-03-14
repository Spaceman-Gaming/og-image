import React from "react";
import { z } from "zod";
import { TemplateIllustration } from "../components/TemplateIllustration";

import { ILayout } from "./types";
import { OnionIllustration } from "../components/OnionIllustration";

const onionLayoutConfig = z.object({
  TemplateImage: z.string().url(),
  Title: z.string(),
  Description: z.string(),
  AuthorImage: z.string().nullish(),
  AuthorName: z.string(),
  Category: z.string().nullish(),
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
  } = config;

  return (
    <div tw="relative flex flex-col w-full h-full">
      <div tw="flex absolute inset-0 w-full h-full">
        <OnionIllustration />
      </div>
      <div tw="flex flex-col justify-between h-full px-20 pt-20 pb-12">
        <img src={TemplateImage} alt={Title} height={64} width={64} />
        <div tw="flex flex-col gap-4">
          <p tw="text-6xl font-bold text-white"></p>
          <div tw="flex grow items-end">
            <p tw="mb-12 text-3xl text-gray-500 max-w-[38rem]"></p>
          </div>
        </div>
        <div tw="mb-1 flex items-end"></div>
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
      default:
        "Umami is a simple, fast, website analytics tool for those who care about privacy.",
    },
    {
      name: "AuthorImage",
      type: "text",
      default: "https://avatars.githubusercontent.com/u/10681116?v=4",
    },
    {
      name: "AuthorName",
      type: "text",
      default: "Percy",
    },
    {
      name: "Category",
      type: "text",
      default: "Analytics",
    },
  ],
  Component,
};
