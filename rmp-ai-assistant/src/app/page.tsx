"use client";
import React from "react";
import { WavyBackground } from "../components/ui/wavy-background";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Box, Button, Stack, TextField } from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { relative } from "path";

export default function WavyBackgroundDemo() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let result = "";

      return reader
        ?.read()
        .then(async function processText({ done, value }): Promise<string> {
          if (done) {
            return result;
          }
          const text = decoder.decode(value || new Uint8Array(), {
            stream: true,
          });
          setMessages((messages) => {
            let lastMessage = messages[messages.length - 1];
            let otherMessages = messages.slice(0, messages.length - 1);
            return [
              ...otherMessages,
              { ...lastMessage, content: lastMessage.content + text },
            ];
          });
          return await reader.read().then(processText);
        });
    });
  };

  return (
    <>
      <WavyBackground className="max-w-4xl mx-auto pb-40">
        <AppBar
          style={{
            background: "linear-gradient(45deg, #ff6b6b, #f06595, #cc5de8)",
          }} // Inline gradient style
        >
          <Toolbar>
            <Typography
              variant="h5"
              sx={{ flexGrow: 1, fontFamily: "sans-serif" }}
            >
              ClassCritique
            </Typography>
            <SignedOut>
              <Button
                sx={{ fontFamily: "serif", fontWeight: "bold" }}
                color="inherit"
                href="/sign-in"
              >
                Login
              </Button>
              <Button
                sx={{ fontFamily: "serif", fontWeight: "bold" }}
                color="inherit"
                href="/sign-up"
              >
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Box
          width="100vw"
          height="100vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          position="relative"
          right="550px"
          top="100px"
        >
          <Typography
            variant="h2"
            sx={{
              fontFamily: "serif",
              color: "transparent",
              marginTop: "100px",
              marginBottom: "60px",
              background: "linear-gradient(45deg, #ff6b6b, #f06595, #cc5de8)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            Chat with us
          </Typography>
          <Stack
            sx={{ backgroundColor: "gray" }}
            direction={"column"}
            width="500px"
            height="700px"
            border="1px solid black"
            p={2}
            spacing={3}
          >
            <Stack
              direction={"column"}
              spacing={2}
              flexGrow={1}
              overflow="auto"
              maxHeight="100%"
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={
                    message.role === "assistant" ? "flex-start" : "flex-end"
                  }
                >
                  <Box
                    bgcolor={
                      message.role === "assistant"
                        ? "primary.main"
                        : "secondary.main"
                    }
                    color="white"
                    borderRadius={16}
                    p={3}
                  >
                    {message.content}
                  </Box>
                </Box>
              ))}
            </Stack>
            <Stack
              direction={"row"}
              spacing={2}
              sx={{ backgroundColor: "white" }}
            >
              <TextField
                label="Message"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button variant="contained" onClick={sendMessage}>
                Send
              </Button>
            </Stack>
          </Stack>
        </Box>
      </WavyBackground>
      <Box width="100%" height="100%" sx={{ backgroundColor: "black" }}>
        <Typography variant="h4" sx={{ fontFamily: "serif", color: "black" }}>
          ClassCritique
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontFamily: "serif", color: "black", backgroundColor: "black" }}
        >
          ClassCritique
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontFamily: "serif", color: "gray", backgroundColor: "black" }}
        >
          The Computer Science Company @2024. All rights reserved.
        </Typography>
      </Box>
    </>
  );
}
