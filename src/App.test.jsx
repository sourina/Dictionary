import { render, screen, waitFor } from "@testing-library/react";
import { beforeAll, afterAll, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import Home from "./home/Home";
import userEvent from "@testing-library/user-event";

// seting up mock API
const server = setupServer(
  http.get("/hello", () => {
    return HttpResponse.json([
      {
        word: "hello",
        phonetics: [
          {
            audio:
              "https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3",
            sourceUrl:
              "https://commons.wikimedia.org/w/index.php?curid=75797336",
            license: {
              name: "BY-SA 4.0",
              url: "https://creativecommons.org/licenses/by-sa/4.0",
            },
          },
          {
            text: "/həˈləʊ/",
            audio:
              "https://api.dictionaryapi.dev/media/pronunciations/en/hello-uk.mp3",
            sourceUrl:
              "https://commons.wikimedia.org/w/index.php?curid=9021983",
            license: {
              name: "BY 3.0 US",
              url: "https://creativecommons.org/licenses/by/3.0/us",
            },
          },
          { text: "/həˈloʊ/", audio: "" },
        ],
        meanings: [
          {
            partOfSpeech: "noun",
            definitions: [
              {
                definition: '"Hello!" or an equivalent greeting.',
                synonyms: [],
                antonyms: [],
              },
            ],
            synonyms: ["greeting"],
            antonyms: [],
          },
          {
            partOfSpeech: "verb",
            definitions: [
              {
                definition: 'To greet with "hello".',
                synonyms: [],
                antonyms: [],
              },
            ],
            synonyms: [],
            antonyms: [],
          },
          {
            partOfSpeech: "interjection",
            definitions: [
              {
                definition:
                  "A greeting (salutation) said when meeting someone or acknowledging someone’s arrival or presence.",
                synonyms: [],
                antonyms: [],
                example: "Hello, everyone.",
              },
              {
                definition: "A greeting used when answering the telephone.",
                synonyms: [],
                antonyms: [],
                example: "Hello? How may I help you?",
              },
              {
                definition:
                  "A call for response if it is not clear if anyone is present or listening, or if a telephone conversation may have been disconnected.",
                synonyms: [],
                antonyms: [],
                example: "Hello? Is anyone there?",
              },
              {
                definition:
                  "Used sarcastically to imply that the person addressed or referred to has done something the speaker or writer considers to be foolish.",
                synonyms: [],
                antonyms: [],
                example:
                  "You just tried to start your car with your cell phone. Hello?",
              },
              {
                definition: "An expression of puzzlement or discovery.",
                synonyms: [],
                antonyms: [],
                example: "Hello! What’s going on here?",
              },
            ],
            synonyms: [],
            antonyms: ["bye", "goodbye"],
          },
        ],
        license: {
          name: "CC BY-SA 3.0",
          url: "https://creativecommons.org/licenses/by-sa/3.0",
        },
        sourceUrls: ["https://en.wiktionary.org/wiki/hello"],
      },
    ]);
  })
);

//Before all test we ask server to listen
beforeAll(() => server.listen());

//After all test we ask server to stop
afterAll(() => server.close());

describe("App", () => {
  beforeEach(() => {
    render(<Home />);
  });
  it("input field must be present", () => {
    const inputElement = screen.getByPlaceholderText("Enter Word");
    expect(inputElement).toBeInTheDocument();
  });
  it("search button must be present", () => {
    const buttonElement = screen.queryByRole("button", { name: "Search" });
    expect(buttonElement).toBeInTheDocument();
  });
  it("if input field empty then show error message", async () => {
    const buttonElement = screen.queryByRole("button", { name: "Search" });
    userEvent.click(buttonElement);
    await waitFor(() => {
      const errorMessage = screen.getByText("Input field empty");
      expect(errorMessage).toBeInTheDocument();
    });
  });
  it("if user input is invalid then show error message", async () => {
    const inputElement = screen.getByPlaceholderText("Enter Word");
    await userEvent.type(inputElement, "hellolkhf");
    const buttonElement = screen.queryByRole("button", { name: "Search" });
    userEvent.click(buttonElement);
    await waitFor(() => {
      const errorMessage = screen.getByText("No words found");
      expect(errorMessage).toBeInTheDocument();
    });
  });
  it("mock api and display data", async () => {
    const inputElement = screen.getByPlaceholderText("Enter Word");
    await userEvent.type(inputElement, "hello");
    expect(inputElement).toHaveValue("hello");
    const buttonElement = screen.queryByRole("button", { name: "Search" });
    userEvent.click(buttonElement);
    await waitFor(() => {
      expect(screen.getByText("noun")).toBeInTheDocument();
    });
  });
  it("mock api and display audio", async () => {
    const inputElement = screen.getByPlaceholderText("Enter Word");
    await userEvent.type(inputElement, "hello");
    expect(inputElement).toHaveValue("hello");
    const buttonElement = screen.queryByRole("button", { name: "Search" });
    userEvent.click(buttonElement);
    await waitFor(() => {
      const audioElement = screen.getByRole("audio");
      expect(audioElement).toBeInTheDocument();
      expect(audioElement.querySelector("source")).toHaveAttribute(
        "src",
        "https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3"
      );
    });
  });
  it("input field should reset after search result not found", async () => {
    const inputElement = screen.getByPlaceholderText("Enter Word");
    await userEvent.type(inputElement, "hellolkhf");
    const buttonElement = screen.queryByRole("button", { name: "Search" });
    userEvent.click(buttonElement);
    await waitFor(() => {
      const inputElement = screen.getByPlaceholderText("Enter Word");
      expect(inputElement).toBeInTheDocument();
    });
  });
  it("input field should reset after search result found", async () => {
    const inputElement = screen.getByPlaceholderText("Enter Word");
    await userEvent.type(inputElement, "hello");
    const buttonElement = screen.queryByRole("button", { name: "Search" });
    userEvent.click(buttonElement);
    await waitFor(() => {
      const inputElement = screen.getByPlaceholderText("Enter Word");
      expect(inputElement).toBeInTheDocument();
    });
  });
});
