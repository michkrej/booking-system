import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "@ui/carousel";
import image_2019_1 from "@/assets/nolleP/2019_1-min.jpeg";
import image_2019_2 from "@/assets/nolleP/2019_2-min.jpeg";
import image_2019_3 from "@/assets/nolleP/2019_3-min.jpeg";
import image_2019_5 from "@/assets/nolleP/2019_5-min.jpeg";
import image_2019_7 from "@/assets/nolleP/2019_7-min.png";
import image_2019_8 from "@/assets/nolleP/2019_8-min.png";
import image_2019_9 from "@/assets/nolleP/2019_9-min.png";
import image_2019_10 from "@/assets/nolleP/2019_10-min.png";
import image_2019_11 from "@/assets/nolleP/2019_11-min.png";
import image_2019_12 from "@/assets/nolleP/2019_12-min.png";
import image_2019_13 from "@/assets/nolleP/2019_13-min.png";
import image_2019_14 from "@/assets/nolleP/2019_14-min.png";
import image_2019_15 from "@/assets/nolleP/2019_15-min.png";

const images = [
  image_2019_10,
  image_2019_2,
  image_2019_1,
  image_2019_5,
  image_2019_3,
  image_2019_7,
  image_2019_12,
  image_2019_8,
  image_2019_9,
  image_2019_11,
  image_2019_14,
  image_2019_15,
  image_2019_13,
];

type NollePCarouselProps = {
  active?: boolean;
};

export const NollePCarousel = ({ active = true }: NollePCarouselProps) => {
  return (
    <Carousel
      plugins={[Autoplay({ delay: 5000, jump: true })]}
      opts={{
        loop: true,
        active,
      }}
      className="h-full"
    >
      <CarouselContent className="h-full">
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <img
              src={image}
              alt="Image"
              className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="fixed right-0 bottom-0 p-2 text-sm text-white transition-all hover:bg-white/50 hover:text-black">
        <a href="https://ceciliaolsson.com/home">Fotograf: Cecilia Olsson</a>
      </div>
    </Carousel>
  );
};
