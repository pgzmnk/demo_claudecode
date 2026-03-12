# python3 frontend.py "your prompt here"

import asyncio
import sys
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage


async def main():
    # Require first CLI argument as prompt
    if len(sys.argv) <= 1:
        print('Usage: python3 frontend.py "<prompt>"', file=sys.stderr)
        sys.exit(1)

    prompt = sys.argv[1]

    # Agentic loop: streams messages as Claude works
    async for message in query(
        prompt=prompt,
        options=ClaudeAgentOptions(
            allowed_tools=[
                "Read",
                "Edit",
                "Glob",
                "Bash",
                "WebSearch",
            ],  # Tools Claude can use
            permission_mode="acceptEdits",  # Auto-approve file edits
        ),
    ):
        # Print human-readable output
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)  # Claude's reasoning
                elif hasattr(block, "name"):
                    print(f"Tool: {block.name}")  # Tool being called
        elif isinstance(message, ResultMessage):
            print(f"Done: {message.subtype}")  # Final result


asyncio.run(main())
