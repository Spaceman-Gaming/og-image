import { NextApiHandler } from "next";
import { z } from "zod";

import { getLayoutAndConfig } from "../../layouts";
import { renderLayoutToSVG, renderSVGToPNG } from "../../og";
import { sanitizeHtml } from "../../layouts/utils";

const imageReq = z.object({
  layoutName: z.string(),
  fileType: z.enum(["svg", "png"]).nullish(),
  seed: z.string().optional(), // Add seed parameter for finding specific attendee
});

const handler: NextApiHandler = async (req, res) => {
  try {
    const {
      layoutName,
      fileType,
      seed = "1",
    } = await imageReq.parseAsync(req.query);

    // Initialize data object that could be populated with attendee info
    let data: any = null;

    // Fetch attendees data if seed is provided
    if (seed) {
      const API_URL = process.env.API_URL || "http://localhost:3000";
      console.log("LOG", API_URL);

      try {
        const response = await fetch(`${API_URL}/api/attendees`);

        if (response.ok) {
          const attendees = await response.json();

          // Find attendee with matching index
          // @ts-ignore - Implicit any in callback parameter
          const attendee = attendees.data?.find(a => a.index === Number(seed));

          if (attendee) {
            console.log("Found attendee by index:", attendee);
            data = attendee;
          } else {
            console.log(`No attendee found with index: ${seed}`);
          }
        } else {
          console.error("Failed to fetch attendees:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching attendees:", error);
      }
    }

    // Create a modified query object with serialized attendee data
    const modifiedQuery = { ...req.query };

    // Add attendee data as a serialized JSON string if data exists
    if (data) {
      modifiedQuery.attendeeData = JSON.stringify(data);
      console.log("Added attendee data to query:", modifiedQuery.attendeeData);
    }

    console.log("Modified query before getLayoutAndConfig:", modifiedQuery);
    
    const { layout, config } = await getLayoutAndConfig(
      layoutName.toLowerCase(),
      modifiedQuery,
    );
    
    // Debug: Check if the config has the attendee data
    console.log("Config after getLayoutAndConfig:", config);
    
    const svg = await renderLayoutToSVG({ layout, config });

    res.statusCode = 200;
    res.setHeader(
      "Content-Type",
      fileType === "svg" ? "image/svg+xml" : `image/${fileType}`,
    );
    res.setHeader(
      "Cache-Control",
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`,
    );

    if (fileType === "png") {
      const png = await renderSVGToPNG(svg);
      res.end(png);
    } else {
      res.end(svg);
    }
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end(
      `<h1>Internal Error</h1><pre><code>${sanitizeHtml(
        (e as any).message,
      )}</code></pre>`,
    );
    console.error(e);
  }
};

export default handler;
