# Codebase as Database
Integrated Development Environments are antiquated.
My brother learned how to code back in the 1970s, but went on to other things.
A while back he asked to see how programming is done these days, and his reaction was that not much has changed.
Launching into an explanation of new features of the latest languages was tempting for me, but not what he was talking about.

He started his career looking at x-ray photos on a light-box.
Now, he can take virtual tours inside a beating heart, or check out how a mutation might affect 3-D protein folding. 
He was surprised at what my IDE looked like, and that it was still, essentially, a text editor. 

I am envious.
I have seen some games for learning coding that have more useful and intuitive visualization capabilities than any advanced IDE.
It is hard to achieve what I am looking for, but I am taking baby steps, and posting progress.
I also know that many of the features I am looking for are out there, but many take significant learning for a result that may or may not prove helpful.

I want my codebase to be in some kind of row-by-row database-like repository, conceptually more sophisticated than a bunch of text files and resources, allowing me to query it in multiple different ways - to generate different views of source code, documentation, test code, static analyses, history, graphical and animated views, and other custom results.  

As aspirational goals, my high-level wish list of features in a future IDE:
- Visual, taking advantage of 3-D, graphical, schematic, text, animation and custom views of a code-base. (Not to exclude audio or other sensory interfaces which could develop)
- Seemlessly multi-view, allowing easy navigation of multiple simultaneous views
- Multi-lingual, allowing focus on design, rather than details of a given computer language, and automatic, or at least easy, porting between languages
- Data-centric, ensuring that at its root, though not always obvious, the code-base is kept in a future-proof open format.

You can't always get what you want, but I have made some progress with existing tools, and a minimal amount of custom tooling, to get a little closer.
The 3-D visualizations are a long way off for me, but I have made some baby steps in organizing my codebase as a database.

# codebasement
Codebase as Database preprocessor and tool-chain using Haxe (was JavaScript) as the macro bodge language.

Runs a development tool-chain, which tidies source code allowing organization along the lines of a database.

Lines of source code are equivalent to records with fields including: (implied) sequence number; code (normally 104 ASCII characters); Notes (unlimited length, avoid escape character); and, miscellaneous key-value data (delimited by escape character).

It would be nice to store this as fields in records, and to edit these fields with a specialized application.
However, given existing tools, it can be done by adopting a specific coding standard in "$-code" files.

The goal is to use a single codebase to generate multiple products, including: industry standard prettified code; documentation of various formats; automated test code; code in formats suitable for import into existing tools and/or custom products.

An optional part of this tool-chain is macro-expansion/processing.
Many languages do not have a standard preprocessor, although many frameworks and language extensions can be seen as preprocessor/compilers.
While some of these tools are undoubtedly useful, most do not offer the developer the oportunity to add their own definitions or macros.
It is not difficult to write bodge code tools to do this task in a tool-chain that run automatically and frequently during development.

This Haxe program is bodge code for processing $-code notes to source code.   https://haxe.org/
Any project-related notes should be in electronic (preferrably text) format in a repo, because they belong to the enterprise, and shareholders should be pissed if not.
Therefore, I am releasing this as $-code, not source code, as an example of my note-taking.

THE FOLLOWING IS NOT SOURCE CODE. THESE ARE MY NOTES!

I like to have the ability to easily and non-distractingly write notes about individual lines or tokens found in the enterprise's source code.
The easiest way to do this is with single-line comments, starting at or after a given column and continuing on a single line until hitting a new-line.
Set your text editor to non-wrapping, and ignore comments that spill of the right side of the screen, or scroll over, or toggle word-wrap to read them.
In general reading long comments is discouraged, unless you need to. 
Beware the Stroop Effect. 

But comments don't work, because:
Extensive note-taking messes with the source code repo.
And, too many devs read all the notes, which can get to be a waste of their time.
Notes are most useful for fixing bugs or perhaps refactoring - otherwise they can be a distraction.

I DON'T WRITE TOO MANY COMMENTS - YOU READ TOO MANY!

I believe notes should be kept separately, in their own repo, in a one-to-zero-or-one relationship between code lines or tokens, and footnotes about them.
This can be achieved with almost any text editor and in-line comments in $-code files, and minimal tooling to strip out most comments, and automatically prettify and post-process to meet desired standards.

My notes are written for my brain, my visual cortex, and my neural net of memories - this bodge code is not for you, especially without reprogramming your brain's familiarity processors, which take about 2 weeks.
However, as a normal part of codebase-as-database methodology, this Haxe code can be exported to a fair number of other programming languages.
And, what do you care how I keep bodge code notes?
If, however, you like my notes, you are welcome to read, copy and use what you like.

However, it is a property of my $-code notes that they can be converted into source code in the enterprise's preferred format, in what is hopefully a fully automated process.
In particular, this file of notes should execute properly as a Haxe file.
I co-locate relevant code, notes, and diagrams whenever possible, so I don't have to switch applications or even pages.
If everything is ASCII, then they can be presented to your eye with minimal effort and distraction on your part, and kept as if data in a database.
```
// The following outlines what I want to do with most $-code to source code projects:                   //>
//   +--------+  +------------+  +------------+      +------------+   +---------+   +---------+         //>
//   | $ code |->| Bodge Pre- |->| Prettify*  |      | Prettify*  |<--| Source  |<--| Manual  |         //> * Post-processing sometimes required.
//   | Notes  |  | Process    |  | 1-1 to AST |      | 1-1 to AST |   | repo ** |   | changes |         //> ** It is preferred that the Source repo code be prettified before it is commited - eliminate a step.
//   +--------+  +------------+  +------------+      +------------+   +---------+   +---------+         //>
//     ^                |                      \    /                                    ^              //>
//     |                v                    +---------+                                 |              //>
//     |     Docs, tests, reports            | Compare |                                 |              //>
//     |                                     +---------+                                 |              //>
// +-------------------------+                    |                                      |              //>
// | Manual edits? Automate? |<----Changes--------+---------Changes->--------------------+              //>
// +-------------------------+                                                                          //>
```
GameMaker
=========
I have been asked to evaluate GameMaker and GML. 
GameMaker is useful for the vast majority of potential game designers because it provide many common 2-D game idioms in an easy-to-learn (or as easy as possible) way.
It also has some finished game export functionality which might prove useful.

I hate the GameMaker IDE and a few annoying things about GML, so I don't edit GML source code in their IDE if I don't have to.
Rather, I use my preferred editor and edit my notes as text files.
I keep their IDE open with a corresponding project, but read from and write to files GameMaker uses, mostly the code and JSON property files, using this tool-chain, set to run from a hot-key.
Graphics files and the like I just import, keep, and edit in the GameMaker project.

For coding in GameMaker, I prefer all code to be organized in a directory structure of my choosing, which is a single file until it gets too big.
Also, I want a few simple macro replacements for coding convenience, because there are some annoying things, and a few dangerous things, in GML. 

I call this code from the command line with options to transfer pre-processed code to a GameMaker project, or from it.
Some paths are hard-coded below, because this is just bodge code at this time. 

Don't complain - fix it.

Feature 1) File splitter from $-code to source:
   Splits and restores files delimited with
```
== == ==path/and/name/of/file.txt
```
lines, kept in order with on the return trip with
```
   /// @description 10002 ...
```
   lines.
Feature 2) Search and replace:
   Keeps a list of any search and replace definitions, specified in comments, in the form of:
```
     $REPLACE>needle >  $WITH>replacement >
```
   Makes replacements, and reverses them on the return trip.
   Sending to GameMaker, and then getting back from GameMaker, should result in no change to $-code file.

