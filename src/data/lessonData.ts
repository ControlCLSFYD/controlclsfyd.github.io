
import { LessonContent } from '../components/LessonScreen';

// Lessons content
export const lessonData: LessonContent[] = [
  {
    id: 1,
    title: "Introduction to online image searching (basic)",
    content: [
      "Google image search is a basic tool that helps the investigator find relevant results online which can enhance his investigation.",
      "While limited, its ease of use and wide availability makes it an essential go-to tool for any Open Source Intelligence (OSINT) investigation.",
      "How: Right click and select search with Google Lens.",
      "On mobile: Press and hold finger on image, select save image. Then open the Google app and click on the camera icon next to the search bar to either select your saved image or take a picture of the image with your camera.",
      "Pros:",
      "- An image with a detectable online record will usually be picked up with Google Lens/Image Search.",
      "- Use your phone camera and the Google app to instantly search vehicles, logos, or buildings.",
      "Cons:",
      "- Doesn't work well if the image on the public record is not identical to the image being searched.",
      "- Doesn't work for people.",
      "Let's test your ability to carry out a successful Google Image Search."
    ]
  },
  {
    id: 2,
    title: "Introduction to building a search query",
    content: [
      "Every search proceeds from the most easily identifiable results.",
      "Let's say you're looking for your friend Klaus in a restaurant. Klaus is a tall, blonde German with a penchant for feet pics.",
      "You wouldn't ask the waiter if he's seen a man who is into feet. Rather, you would ask for the tall, blonde German called Klaus.",
      "Specific questions follow from general questions.",
      "This next level will prove whether you can build a basic search query based on prior search results."
    ]
  },
  {
    id: 3,
    title: "Introduction to exact match Boolean search",
    content: [
      "Boolean is the method used to construct accurate parameters for an online search engine query.",
      "Boolean queries are binoculars for a search engine user. They let you see much further and with greater precision.",
      "The primary Boolean operator used by an OSINT investigator are \"quotation marks\".",
      "Quotation marks force a search engine to find an exact match of the terms in the quotation marks.",
      "You should use these quotation marks around key words which you know are essential to find the desired search results.",
      "Can you combine the lessons of the previous lesson with this one? We'll see."
    ]
  },
  {
    id: 4,
    title: "Search Query Construction Using Exact Match",
    content: [
      "So, you can construct a query following an accurate online image search. You know how to use the exact match Boolean operators to help you find the desired result.",
      "But can you do all these things without an image search kickstarting your investigation?",
      "Let's find out."
    ]
  },
  {
    id: 5,
    title: "Speed Run Level",
    content: [
      "What are you doing?!? This is the speed run level, it's here to test you on what you already know, go back and do it. Quick!"
    ]
  }
];
