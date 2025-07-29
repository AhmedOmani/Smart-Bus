# AI Assistant Onboarding Protocol

This document contains a script to quickly bring a new AI assistant up to speed on the Smart Bus project.

## Instructions

At the beginning of any new development session, follow these two steps:

### Step 1: Run the Terminal Command

Execute the following command in your terminal. This command will print the contents of the most critical documentation files.

```bash
cat docs/00_Project_Vision.md docs/01_System_Requirements.md docs/02_System_Architecture.md docs/05_Feature_Backlog_and_User_Stories.md docs/06_PWA_Reliability_Pledge.md
```

### Step 2: Use the "Magic Prompt"

Copy the **entire output** from the terminal command in Step 1. Then, create a new message to the AI assistant, pasting the following text first, followed by the documentation you just copied.

---

**(Copy from this line downwards and paste into the chat)**

Hello. You are an AI pair programmer helping me build the "Smart Bus Tracking System." Your primary goal is to help me continue development on this project.

I am providing you with the complete and up-to-date project documentation below. This contains the project vision, functional and non-functional requirements, system architecture, and the complete feature backlog.

Please review it carefully. Once you have finished, please confirm that you have understood the context and are ready to proceed. Do not summarize the documents unless I ask you to.

**--- BEGIN DOCUMENTATION ---**

**(Paste the output from the terminal command here)**

**--- END DOCUMENTATION ---** 