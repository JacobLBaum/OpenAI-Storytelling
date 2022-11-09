import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [storyInput, setStoryInput] = useState("");
  const [result, setResult] = useState();
  const [image, setImage] = useState();
  const [character, setCharacter] = useState('green fairy');
  const [storyHolder, setStoryHolder] = useState();
  const [story, setStory] = useState([]);

  async function characterSubmit(event) {
    event.preventDefault();
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ character: character, first: true }),
    });
    const data = await response.json();
    setResult(data.result);
    setStory(story => [...story, data.result])

    setImage("/loading.gif")
    const imgResponse = await fetch("/api/generateImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: data.result }),
    });
    const imgData = await imgResponse.json();
    setImage(imgData.result)
  }


  async function storySubmit(event) {
    event.preventDefault();
    setImage("/loading.gif")
    setResult();
    setStoryHolder('');
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ story: story, storyInput: storyInput}),
    });
    const data = await response.json();
    setResult(data.result);
    setStory(story => [...story, data.result])

    setImage("/loading.gif")
    const imgResponse = await fetch("/api/generateImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: data.result }),
    });
    const imgData = await imgResponse.json();
    setImage(imgData.result)
  }

  return (
    <div>
      <Head>
        <title>OpenAi Storytelling</title>
        <link rel="icon" href="/book.png" />
      </Head>

      <main className={styles.main}>
        <img src="/book.png" className={styles.icon} />
        <h3>Who are you? Ex: {character}</h3>
        <form onSubmit={characterSubmit}>
          <input
            type="text"
            name="character"
            placeholder="Enter an character"
            onChange={(e) => setCharacter(e.target.value)}
          />
          <input type="submit" value="Start the story" />
        </form>

        <p>{result}</p>

        <h3>What happens next...</h3>
        <form onSubmit={storySubmit}>
          <input
            type="text"
            name="story"
            placeholder="Continue the story"
            value={storyHolder}
            onChange={(e) => {
              setStoryInput(e.target.value)
              setStoryHolder(e.target.value)
            }}
          />
          <input type="submit" value="Generate" />
        </form>
        <img src={image} className={styles.dalle} />
      </main>
    </div>
  );
}
