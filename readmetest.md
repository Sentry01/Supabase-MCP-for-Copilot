# Custom Instructions and Prompt Guide

Custom instructions are specialized directives that help personalize and enhance your interaction with AI assistants. This guide explains how to effectively use and manage custom instructions.

## What Are Custom Instructions?

Custom instructions are persistent preferences and context that you can set to customize how an AI assistant interacts with you. They help the AI:
- Understand your background and expertise
- Follow your preferred coding style and conventions
- Remember important project-specific details
- Maintain consistency across conversations

## Setting Up Custom Instructions

### Basic Structure
Custom instructions typically consist of two main parts:

1. **Background and Preferences**
```
You are [role/expertise]
The user will [typical scenarios]
Keep in mind [important considerations]
```

2. **Tool Usage Guidelines**
```
When using tools:
- Follow specific patterns
- Include required properties
- Validate changes
- Handle errors appropriately
```

### Best Practices

1. **Be Specific**
   - Clearly state your preferences
   - Include relevant technical context
   - Specify coding standards

2. **Stay Relevant**
   - Focus on persistent, reusable instructions
   - Avoid request-specific details
   - Keep instructions concise but comprehensive

3. **Maintain Structure**
   - Use consistent formatting
   - Group related instructions
   - Include examples where helpful

## Example Custom Instructions

```
<instructions>
You are a senior full-stack developer with expertise in Node.js and React
Always use TypeScript for new files
Follow the project's existing code style
Prefer functional components in React
Include proper error handling
Write unit tests for new functionality
</instructions>

<toolUseInstructions>
Validate all file changes with appropriate tools
Check for type errors in TypeScript files
Run tests after making changes
Document API changes
</toolUseInstructions>
```

## Benefits

- Consistent coding style across sessions
- Reduced need to repeat preferences
- More accurate and relevant responses
- Better adherence to project standards
- Improved efficiency in completing tasks

## Tips for Maintenance

1. **Regular Updates**
   - Review and update instructions periodically
   - Add new preferences as they emerge
   - Remove outdated instructions

2. **Version Control**
   - Keep a backup of your instructions
   - Document major changes
   - Share with team members when relevant

## Common Pitfalls to Avoid

1. Don't make instructions too specific to a single task
2. Avoid contradictory instructions
3. Don't include sensitive information
4. Keep instructions concise but clear
5. Don't override project-specific standards

## Creating an Effective Prompt File

A prompt file is a specialized file that helps structure your interactions with GitHub Copilot. Here's how to create one:

### Basic Prompt File Structure

```markdown
<instructions>
# Core Behavior Instructions
You are [define the AI's role and expertise]
The user will [describe typical use cases]
Keep in mind [list important considerations]
</instructions>

<toolUseInstructions>
# Tool Usage Guidelines
When using tools:
- Follow specific patterns for each tool
- Include all required properties
- Validate changes after making them
- Handle errors appropriately
</toolUseInstructions>

<editFileInstructions>
# File Editing Guidelines
- Read files before editing
- Use proper tools for file modifications
- Follow code style conventions
- Validate changes after edits
</editFileInstructions>

<context>
# Workspace Context
My current OS is: [operating system]
Current workspace structure:
[folder structure]
</context>

<reminder>
# Important Reminders
[Any specific rules or preferences to reinforce]
</reminder>
```

### Key Components of a Prompt File

1. **Instructions Block**
   - Define the AI's role and expertise level
   - Specify expected behaviors and limitations
   - Set general guidelines for interactions
   - Example:
   ```
   <instructions>
   You are a highly sophisticated automated coding agent with expert-level knowledge
   The user will ask technical questions and request code implementations
   Always prioritize best practices and security
   Follow project-specific conventions and standards
   </instructions>
   ```

2. **Tool Use Instructions**
   - Specify how to use available tools
   - Define validation requirements
   - Set error handling expectations
   - Example:
   ```
   <toolUseInstructions>
   When using a tool:
   - Follow the json schema carefully
   - Include ALL required properties
   - Validate results after tool use
   - Use appropriate error handling
   </toolUseInstructions>
   ```

3. **Edit File Instructions**
   - Define file modification procedures
   - Set code style requirements
   - Specify validation steps
   - Example:
   ```
   <editFileInstructions>
   - Read files before modifying
   - Group changes by file
   - Validate changes with appropriate tools
   - Follow project coding standards
   </editFileInstructions>
   ```

4. **Context Block**
   - Provide workspace information
   - Include OS details
   - List project structure
   - Example:
   ```
   <context>
   My current OS is: macOS
   Workspace structure:
   - src/
   - docs/
   - tests/
   </context>
   ```

5. **Reminders**
   - Add specific rules to reinforce
   - Include coding preferences
   - Highlight important constraints
   - Example:
   ```
   <reminder>
   Always use TypeScript for new files
   Follow semantic versioning
   Document API changes
   </reminder>
   ```

### Best Practices for Prompt Files

1. **Be Explicit**
   - Clearly state requirements
   - Define boundaries and limitations
   - Specify preferred coding styles

2. **Maintain Hierarchy**
   - Organize instructions logically
   - Group related guidelines
   - Use clear section headers

3. **Keep it Updated**
   - Regular review and updates
   - Remove obsolete instructions
   - Add new requirements as needed

4. **Include Examples**
   - Provide sample code snippets
   - Show expected formats
   - Demonstrate proper tool usage

### Common Mistakes to Avoid

1. Vague or ambiguous instructions
2. Conflicting guidelines
3. Missing context information
4. Overcomplicated requirements
5. Insufficient error handling guidance

## Using Your Prompt File

1. Save the file in your project root
2. Reference it at the start of sessions
3. Update as project needs evolve
4. Share with team members for consistency

Remember that a well-structured prompt file helps ensure consistent, high-quality interactions with GitHub Copilot across your entire project.

## Conclusion

Custom instructions are a powerful tool for maintaining consistency and efficiency in your development workflow. When properly configured, they help ensure that AI assistance aligns with your preferences and project requirements.