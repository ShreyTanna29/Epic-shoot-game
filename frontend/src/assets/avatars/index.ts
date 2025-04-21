import { scale } from "@cloudinary/url-gen/actions/resize";
import { cld } from "../../utils/cloudinary";

const images: string[] = [];

for (let i = 1; i <= 15; i++) {
  const img = cld
    .image(`a${i}`)
    .format("auto")
    .quality("auto")
    .resize(scale().width(60));
  images.push(img.toURL());
}

export { images };
