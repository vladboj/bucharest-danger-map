## About

I came across a danger heatmap of Bucharest, and the idea for this project came to mind. It is an app for looking up the danger level of most any street in Bucharest.

## Functionality

- Search for streets
- Live location

## Usage

- ~~Access the website from [this link]()~~ no link yet
- I hope the UI is pretty intuitive, so just use it :)

## Technologies

- **Frontend:** React, TypeScript, Tailwind CSS, Leaflet
- **Backend:** Express, TypeScript

## Problem Solution

Initially, I only had a PNG representing the danger heatmap. The idea was to find a way of converting an address entered by the user into a pixel and extract its color while assigning it a danger level. This sounds like a decent solution, but the heatmap needed to be modified.

For context, the image was the heatmap with a white background and a black border between them. An idea for extracting the danger level from a pixel was to derive it from the hue of the pixel. Upon closer inspection of the image using Photopea, the idea seemed feasible but its structure presented some problems. Since the whole image was apparently anti-aliased, the border formed some weird artifacts with the white background, making it difficult to delimit the heatmap from the background, so I took a few minutes to manually carve out the border while losing a bit of data (trading it off for some simplicity :P). Another problem was that the image had some street artifacts left, which could have been a problem as they seemed to interfere with the heatmap's colors. Fortunately, after turning up the saturation and brightness of all the pixels, the streets seemed to have dissapeared and were no longer a problem. Upon further visual inspection, I found it appropriate to apply some Gaussian blur for smoothing. Finally, the image was ready for utilization.

Now, the only thing remaining was to create an algorithm for converting a street address into a pixel coordinate within the image. For this, I used a geocoding API for converting the address into latitude and longitude, which were going to be converted into pixel coordinates. The problem is that I don't know how the geographic plane relates to the actual heatmap. For my use case, an affine transformation is likely good enough. So I picked a few GCPs (Ground Control Points) common in both planes and obtained the affine coefficients. After having the transformation for converting geographic coordinates to pixel coordinates, we just need to put everything together and that's it.

As a side note, I think it's worth mentioning that I'm aware this is just one possible solution and due to the time I was willing to allocate to this project, it likely has significant problems, especially on the coordinate transformation front. Still, it's probably good enough for getting an idea about the danger level in an area, while also having provided me with a fun learning experience.

## Architecture

The backend does 2 things:
- Acts as a proxy for rate-limiting the requests to [Nominatim API](https://nominatim.org/) according to its usage policy
- Exposes endpoint for obtaining danger data for a given latitude-longitude pair