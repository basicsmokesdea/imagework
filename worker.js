import { Image } from "imagescript";

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const imageUrl = url.searchParams.get("url");

        if (!imageUrl) {
            return Response.json({
                error: "Missing image URL"
            }, { status: 400 });
        }

        const response = await fetch(imageUrl);  

        if (!response.ok) {
            return Response.json({
                error: "Could not fetch image"
            }, { status: 400 });
        }

        const image = await Image.decode(
            await response.arrayBuffer()
        );

        const contentType = response.headers.get("content-type");

        if (contentType?.includes("image/GIF")) {
                console.log("It's a GIF!");
        } else if (contentType?.startsWith("image/")) {
            console.log("It's a regular image!");
        } else {
            console.log("Not an image!");
        } 
        
        const scale = Math.min(
                64 / image.width,
                64 / image.height,
                1
        );

        const width = Math.max(1, Math.floor(image.width * scale));
        const height = Math.max(1, Math.floor(image.height * scale));

        image.resize(width, height);

        const pixels = [];

        for (let y = 0; y < image.height; y++) {
            const row = [];

            for (let x = 0; x < image.width; x++) {
                const color = image.getPixelAt(x, y);

                row.push([
                    (color >> 24) & 255,
                    (color >> 16) & 255,
                    (color >> 8) & 255
                ]);
            }

            pixels.push(row);
        }

        return Response.json({
            width: image.width,
            height: image.height,
            pixels
        });
    }
};
