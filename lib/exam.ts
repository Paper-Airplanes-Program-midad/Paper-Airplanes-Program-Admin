

export type Msg = string;

export type ExamChoice = { id: string; label: string };

export type ExamQuestion =
  | { id: string; n: number; label?: string; kind: "choice"; prompt: string; choices: ExamChoice[] }
  | { id: string; n: number; label?: string; kind: "multi"; prompt: string; choices: ExamChoice[] }
  | { id: string; n: number; label?: string; kind: "short"; prompt: string }
  | { id: string; n: number; label?: string; kind: "long"; prompt: string };

export type ExamGroup = {
  id: string;
  title: string;
  note?: string;
  questions: ExamQuestion[];
};

export type ExamPart = {
  id: string;
  label: string;
  title: Msg;
  intro: Msg;
  passage?: { title: string; author: string; body: string[] };
  video?: { title: string; youtubeId: string; url: string };
  groups: ExamGroup[];
};

export type Exam = {
  title: Msg;
  intro: Msg;
  minutes: number;
  parts: ExamPart[];
};

const ARTICLE_BODY = [
  "Dear Student,",
  "Harvard University recently cancelled admission offers to about 10 incoming freshmen. Why? They had participated in a private Facebook group sharing inappropriate, offensive memes. The incident has sparked a lot of discussion. Was Harvard right to make this decision? What about the First Amendment, which grants the right to freedom of speech to all Americans in the Constitution? Do young people know the dangers of social media?",
  "I'm a teacher at a business school and a career services counselor. I have also worked as a recruiter helping companies find the right employees. I've seen how social media becomes part of a person's brand. Your brand can help you or hurt you.",
  "College admissions staff, future employers and even dates have one thing in common. They are more and more likely to search for you on social media sites. From what they find there, they will make decisions or judgments about you. Here's what you should know. Don't end up like those students who applied to Harvard.",
  "1. Social Media Posts Disappear, Right?",
  "Let's be clear about one thing: You've been building your online reputation since your first Snapchat. Think the posts disappear? Think private pages are private? Think again.",
  "You might feel like your life and opinions are no one's business. But you can't always control who sees what you post. Every photo, video, tweet, like and comment could be screenshotted by your friends (or frenemies). You might accidentally make a post public instead of private. Or, you might post to the wrong account. And it isn't as hard as you might think to find ways to view photos and posts you think are well hidden.",
  "2. Do Employers And Colleges Actually Look At This Stuff?",
  "College admissions officers and employers are very likely to look at your social media presence. The job website CareerBuilder conducted a social media survey in 2017. It showed that more employers than ever are screening people who apply for jobs:",
  "• Six hundred percent more employers use social media to screen than they did in 2006.\n• Seventy percent of employers use social networking sites to research job candidates.\n• Thirty-four percent of employers found online content that caused them to scold or even fire an employee.",
  "This trend is common at colleges as well. Kaplan Test Prep conducted a survey of over 350 college admissions officers in 2017. This survey found that 35 percent checked applicants' social media profiles. Many who do say social media has influenced their admission decisions.",
  "3. What Are Recruiters Watching Out For?",
  "So what type of content should you avoid posting online? When I recruited, some types of posts left a bad impression on me. They included:",
  "• References to drugs and other inappropriate subject matter\n• Damaging or embarrassing photos or videos\n• Insulting or hateful language or comments\n• Politically charged attacks\n• Spelling and grammar mistakes\n• Complaining or bad-mouthing",
  "4. What Can I Do To Build A Positive Online Reputation?",
  "Remember that social media is not all bad. In many cases it helps recruiters get a good feel for who you are. It will also give them an idea of how well you will fit within the company. The CareerBuilder survey found 44 percent of employers who screened candidates using social networks found positive information. This information actually caused them to hire a candidate.",
  "From my experience, some information can be very positive to recruiters. This includes:",
  "• Your education and experiences match the recruiter's requirements.\n• Your profile picture and summary are professional.\n• Your personality and interests are similar to those of the company or university.\n• Your involvement in community or social organizations shows character.\n• You have positive, supportive comments and responses.",
  "5. How Do I Clean Things Up?",
  "Research. Both the college of your dreams and your future employer could Google you. So you should do the same thing! Also, check all of your social media profiles, even the ones you haven't used for a while.",
  "Get rid of anything that could send the wrong message. Remember, things can't be unseen.",
  "Bottom line: Would you want a future boss, admissions officer or blind date to read or see it? If not, don't post it. And if you already have, remove it.",
  "Sincerely,\nYour Career Counselor",
  "Thao Nelson is a lecturer at Kelley School of Business, Indiana University, in Indiana.",
];

function vocab(n: number, word: string, options: string[]): ExamQuestion {
  return {
    id: `dx-${n}`,
    n,
    kind: "choice",
    prompt: word,
    choices: options.map((label, index) => ({ id: String.fromCharCode(97 + index), label })),
  };
}

function choice(n: number, prompt: string, options: string[]): ExamQuestion {
  return {
    id: `dx-${n}`,
    n,
    kind: "choice",
    prompt,
    choices: options.map((label, index) => ({ id: String.fromCharCode(97 + index), label })),
  };
}

function multi(n: number, prompt: string, options: string[]): ExamQuestion {
  return {
    id: `dx-${n}`,
    n,
    kind: "multi",
    prompt,
    choices: options.map((label, index) => ({ id: String.fromCharCode(97 + index), label })),
  };
}

const short = (n: number, prompt: string, label?: string): ExamQuestion => ({
  id: `dx-${n}`,
  n,
  label,
  kind: "short",
  prompt,
});

const long = (n: number, prompt: string): ExamQuestion => ({
  id: `dx-${n}`,
  n,
  kind: "long",
  prompt,
});

export const diagnosticExam: Exam = {
  minutes: 60,
  title: "diagnostic.title",
  intro: "diagnostic.intro",
  parts: [
    {
      id: "reading",
      label: "I. Reading",
      title: "diagnostic.reading.title",
      intro: "diagnostic.reading.intro",
      passage: {
        title: "Be Smart About It: How to Use Social Media to Your Advantage",
        author: "by Thao Nelson, Indiana University",
        body: ARTICLE_BODY,
      },
      groups: [
        {
          id: "part-a",
          title: "Part A: Multiple Choice — Vocabulary",
          note: "Please select the correct meaning of the vocabulary based on the text above.",
          questions: [
            vocab(1, "to cancel", [
              "to mark wrong",
              "to contact online",
              "to begin",
              "to remove or call off",
            ]),
            vocab(2, "incident", [
              "a mistake",
              "improper or offensive",
              "a serious event or action",
              "an online message",
            ]),
            vocab(3, "counselor", [
              "a person trained to give guidance on personal, social, or psychological problems",
              "a diplomat who bridges cultures and important politicians together",
              "a person who asks for advice and needs help",
              "someone who is lost and is looking for directions",
            ]),
            vocab(4, "brand", [
              "pieces of grain husk separated from flour after milling",
              "to burn a mark into an animal",
              "a company or person's marker or identity",
              "to be erased or obliterated from civilization",
            ]),
            vocab(5, "content", [
              "a container holding materials, such as a water bottle which holds water",
              "to be upset, angry, or unhappy with a situation",
              "the ideas, thoughts, and information included",
              "clues or hints about what is in a book",
            ]),
            vocab(6, "trend", [
              "out of fashion or out of touch with modern style",
              "the standard and unchanging ways of an event or action",
              "to shy away from or turn away from a behavior",
              "practice or pattern over a long period of time",
            ]),
            vocab(7, "to influence", [
              "a person of humble means trying to exact revenge",
              "to have an effect on the character or behavior of someone or something",
              "to tire others out and turn them away",
              "to be totally helpless and not affecting towards others",
            ]),
            vocab(8, "embarrassing", [
              "causing the feeling of confusion and shame about something",
              "causing the feeling of sadness or anger about something",
              "to hug and hold someone; embracing someone",
              "feeling confident and calm in a situation",
            ]),
            vocab(9, "candidate", [
              "someone who has a job already",
              "a person who is applying for school or a job",
              "a person covered in candy and dates",
              "a contest where everyone wins a prize",
            ]),
            vocab(10, "to screen", [
              "to yell loudly at someone or something",
              "to inspect",
              "a barrier for a window made of wire",
              "to create a device which makes ice cream",
            ]),
          ],
        },
        {
          id: "part-b",
          title: "Part B: Reading — Reading Comprehension",
          note: "Select all of the correct answers. There may be more than one right answer.",
          questions: [
            multi(
              11,
              "According to the article, many people look at your social media pages for information about you. These people may include:",
              ["Admissions counselors", "Friends", "Employees", "Employers"],
            ),
            multi(
              12,
              "The author recommends doing what to make sure your profile sends a positive message?",
              [
                "Make all of your posts public",
                "Check your old posts and remove anything inappropriate",
                "Hide your profile picture",
                "Change your name",
              ],
            ),
            multi(13, "What should you not post on social media according to the author?", [
              "Your resume",
              "Incriminating photos",
              "Hate speech",
              "Pictures from your vacation",
            ]),
            multi(14, "What data does the author give to support her argument?", [
              "10 students lost their admission to Harvard because of Facebook posts",
              "Most employers do not research job applicants on social media",
              "35% of admissions counselors look at social media before accepting students",
              "600 companies looked at social media in 2016",
            ]),
            multi(
              15,
              "Before you apply to a university or for a job, the author suggests that you should:",
              [
                "Keep everything the same",
                "Call the school or company and ask if they look at social media",
                "Delete your profile",
                "Research the school or company",
              ],
            ),
          ],
        },
      ],
    },
    {
      id: "writing",
      label: "II. Writing",
      title: "diagnostic.writing.title",
      intro: "diagnostic.writing.intro",
      groups: [
        {
          id: "prompts",
          title: "Writing prompts",
          questions: [
            long(
              16,
              'Based on the reading above, "Be Smart About It: How to Use Social Media to Your Advantage," write a social media plan for yourself. Use the following verb tenses and verb forms: 1.) Imperative; 2.) Progressive/Continuous (past, present, future); 3.) Simple (past, present, future). Write at least 5 sentences.',
            ),
            long(
              17,
              "Would you recommend this article to a friend? Why or why not? Write at least three sentences explaining your reasoning.",
            ),
          ],
        },
        {
          id: "grammar",
          title: "Writing & Grammar",
          note: "Finish the sentences below in MIXED TENSES. The tense and verb is provided. Please only fill in the blank, do not rewrite the whole sentence.",
          questions: [
            short(18, "________ (you watch/negative, simple past) the news? You won't believe your eyes."),
            short(19, "I ________ (work/present perfect) for big companies like this before. I know how they operate."),
            short(
              20,
              "They ________ (live/past perfect) in New York for 3 years before they ________ (move/simple past) to Seattle three months ago.",
              "20/21",
            ),
            short(22, "Mahmoud ________ (study/past perfect progressive) for four hours when his father arrived."),
            short(23, "By this time next year, I ________ (finish/future perfect) the course."),
            short(24, "I ________ (start/present progressive) to speak perfect English."),
            short(25, "Samirah ________ (drive/past perfect) for six hours when she arrived in the village."),
            short(26, "She ________ (drive/present perfect) more than 300 miles."),
            short(27, "They ________ (work/future progressive) for two hours tonight."),
          ],
        },
      ],
    },
    {
      id: "listening",
      label: "III. Listening",
      title: "diagnostic.listening.title",
      intro: "diagnostic.listening.intro",
      video: {
        title: "What Makes a Hero? — Matthew Winkler (TED-Ed)",
        youtubeId: "Hhk4N9A0oCA",
        url: "https://youtu.be/Hhk4N9A0oCA",
      },
      groups: [
        {
          id: "listening-questions",
          title: "Questions",
          questions: [
            choice(28, "A hero's journey can be best described as…", [
              "an easy adventure",
              "a cycle",
              "a timeline",
              "a journal",
            ]),
            choice(29, 'Based on this video, when does the "status quo" first take place?', [
              "it does not happen at all",
              "the beginning",
              "the end or conclusion",
              "the middle of the action",
            ]),
            choice(30, "Departure is a synonym (another word) for which term?", [
              "entrance",
              "staying",
              "leaving",
              "dying",
            ]),
            choice(
              31,
              "According to the video, solving a riddle, slaying a monster, and escaping from a trap are examples of what?",
              ["trials", "adventures", "games", "plot points"],
            ),
            choice(32, "When the hero returns to the status quo, they are…", [
              "changed and an upgraded person",
              "changed but more scared of the world around them",
              "unchanged and did not learn much",
              "unchanged and happily going back to their old life",
            ]),
            choice(
              33,
              "In the conclusion of the story, the author tells us that the hero's journey can be found…",
              [
                "across all cultures, time, and peoples",
                "in comic books and movies",
                "only in our siblings and parents",
                "on the cover of magazines",
              ],
            ),
            short(34, 'Finish this quote from the video: "In the cave you fear to enter ________."'),
            long(35, "What is the main idea of this video?"),
            long(36, "Provide three details that support the main idea. Write in complete sentences."),
          ],
        },
      ],
    },
  ],
};

export function examQuestions(exam: Exam): ExamQuestion[] {
  return exam.parts.flatMap((part) => part.groups.flatMap((group) => group.questions));
}
