import { diagnosticExam, type Exam } from "@/lib/exam";

export type Msg = string;

export type Item = { text: Msg; sub?: Msg[] };

export type Contact = {
  role: Msg;
  name?: string;
  email: string;
  note?: Msg;
};

export type Choice = { id: string; label: Msg };

export type Question =
  | { id: string; kind: "text"; prompt: Msg; accept: string[]; placeholder?: Msg }
  | { id: string; kind: "choice"; prompt: Msg; choices: Choice[]; answer: string }
  | {
      id: string;
      kind: "grid";
      prompt: Msg;
      columns: Choice[];
      rows: { id: string; label: Msg; answer: string }[];
    };

export type ProseBlock = { kind: "prose"; body: Msg };

export type StepsBlock = { kind: "steps"; title?: Msg; ordered?: boolean; items: Item[] };

export type NoteBlock = { kind: "note"; title?: Msg; body: Msg };

export type ContactsBlock = { kind: "contacts"; items: Contact[] };

export type ReadBlock = {
  kind: "read";
  id: string;
  title: Msg;
  note?: Msg;
  src: string;
  pages: number;
  optional?: boolean;
};

export type WatchBlock = {
  kind: "watch";
  id: string;
  title: Msg;
  note?: Msg;
  src?: string;
  optional?: boolean;
};

export type QuizBlock = {
  kind: "quiz";
  id: string;
  title: Msg;
  note?: Msg;
  questions: Question[];
};

export type LinksBlock = {
  kind: "links";
  title?: Msg;
  items: { label: Msg; note?: Msg; href?: string }[];
};

export type CardsBlock = {
  kind: "cards";
  items: { title: Msg; body: Msg; tone?: "accent" | "cool" }[];
};

export type ExamBlock = { kind: "exam"; id: string; exam: Exam };

export type AgreementBlock = {
  kind: "agreement";
  id: string;
  title: Msg;
  note?: Msg;
  statement: Msg;
};

export type Block =
  | ProseBlock
  | StepsBlock
  | NoteBlock
  | ContactsBlock
  | ReadBlock
  | WatchBlock
  | QuizBlock
  | LinksBlock
  | CardsBlock
  | ExamBlock
  | AgreementBlock;

export type TrackedBlock = ReadBlock | WatchBlock | QuizBlock | ExamBlock | AgreementBlock;

export type Section = { id: string; title?: Msg; blocks: Block[] };

export type Unit = {
  slug: string;
  order: number;
  title: Msg;
  summary: Msg;
  minutes: number;
  sections: Section[];
  draft?: boolean;
};

export const PASS_MARK = 0.7;

export function questionPoints(question: Question): number {
  return question.kind === "grid" ? question.rows.length : 1;
}

export function quizPoints(questions: Question[]): number {
  return questions.reduce((total, question) => total + questionPoints(question), 0);
}

const unitIntro: Unit = {
  slug: "getting-started",
  order: 0,
  minutes: 10,
  title: "course.getting-started.1",
  summary: "course.getting-started.2",
  sections: [
    {
      id: "welcome",
      title: "course.getting-started.3",
      blocks: [
        {
          kind: "prose",
          body: "course.getting-started.4",
        },
        {
          kind: "note",
          title: "course.getting-started.5",
          body: "course.getting-started.6",
        },
        {
          kind: "prose",
          body: "course.getting-started.7",
        },
      ],
    },
    {
      id: "overview",
      title: "course.getting-started.8",
      blocks: [
        {
          kind: "prose",
          body: "course.getting-started.9",
        },
        {
          kind: "steps",
          ordered: true,
          items: [
            {
              text: "course.getting-started.10",
            },
            {
              text: "course.getting-started.11",
            },
            {
              text: "course.getting-started.12",
            },
            {
              text: "course.getting-started.13",
            },
            {
              text: "course.getting-started.14",
            },
            {
              text: "course.getting-started.15",
            },
            {
              text: "course.getting-started.16",
            },
          ],
        },
        {
          kind: "prose",
          body: "course.getting-started.17",
        },
        {
          kind: "contacts",
          items: [
            {
              role: "course.getting-started.18",
              email: "admissions@paper-airplanes.org",
            },
          ],
        },
      ],
    },
    {
      id: "objectives",
      title: "course.getting-started.19",
      blocks: [
        {
          kind: "prose",
          body: "course.getting-started.20",
        },
        {
          kind: "steps",
          items: [
            {
              text: "course.getting-started.21",
            },
            {
              text: "course.getting-started.22",
            },
            {
              text: "course.getting-started.23",
            },
            {
              text: "course.getting-started.24",
            },
            {
              text: "course.getting-started.25",
            },
          ],
        },
        {
          kind: "note",
          body: "course.getting-started.26",
        },
      ],
    },
  ],
};

const unitWhoWeAre: Unit = {
  slug: "who-we-are",
  order: 1,
  minutes: 20,
  title: "course.who-we-are.1",
  summary: "course.who-we-are.2",
  sections: [
    {
      id: "story",
      title: "course.who-we-are.3",
      blocks: [
        {
          kind: "prose",
          body: "course.who-we-are.4",
        },
        {
          kind: "steps",
          title: "course.who-we-are.5",
          ordered: true,
          items: [
            {
              text: "course.who-we-are.6",
            },
          ],
        },
        {
          kind: "read",
          id: "u1-programmes",
          optional: true,
          src: "/pdf/paper-airplanes-programs-ar.pdf",
          pages: 3,
          title: "course.who-we-are.7",
          note: "course.who-we-are.8",
        },
      ],
    },
    {
      id: "team",
      title: "course.who-we-are.9",
      blocks: [
        {
          kind: "contacts",
          items: [
            {
              role: "course.who-we-are.10",
              email: "admissions@paper-airplanes.org",
              note: "course.who-we-are.11",
            },
            {
              role: "course.who-we-are.12",
              name: "Muhammad",
              email: "muhammad@paper-airplanes.org",
              note: "course.who-we-are.13",
            },
            {
              role: "course.who-we-are.14",
              name: "Ibrahim Alaboud",
              email: "ibrahim@paper-airplanes.org",
              note: "course.who-we-are.15",
            },
          ],
        },
        {
          kind: "note",
          title: "course.who-we-are.16",
          body: "course.who-we-are.17",
        },
        {
          kind: "prose",
          body: "course.who-we-are.18",
        },
        {
          kind: "prose",
          body: "course.who-we-are.19",
        },
      ],
    },
  ],
};

const unitBeingAStudent: Unit = {
  slug: "being-a-student",
  order: 2,
  minutes: 45,
  title: "course.being-a-student.1",
  summary: "course.being-a-student.2",
  sections: [
    {
      id: "intro",
      title: "course.being-a-student.3",
      blocks: [
        {
          kind: "prose",
          body: "course.being-a-student.4",
        },
        {
          kind: "steps",
          title: "course.being-a-student.5",
          ordered: true,
          items: [
            {
              text: "course.being-a-student.6",
            },
            {
              text: "course.being-a-student.7",
            },
            {
              text: "course.being-a-student.8",
            },
          ],
        },
      ],
    },
    {
      id: "safeguarding",
      title: "course.being-a-student.9",
      blocks: [
        {
          kind: "read",
          id: "u2-safeguarding-doc",
          src: "/pdf/safeguarding-code-of-conduct-ar.pdf",
          pages: 5,
          title: "course.being-a-student.10",
          note: "course.being-a-student.11",
        },
        {
          kind: "quiz",
          id: "u2-safeguarding-quiz",
          title: "course.being-a-student.12",
          note: "course.being-a-student.13",
          questions: [
            {
              id: "sg-1",
              kind: "text",
              prompt: "course.being-a-student.14",
              accept: ["ibrahim@paper-airplanes.org"],
              placeholder: "course.being-a-student.15",
            },
            {
              id: "sg-2",
              kind: "choice",
              prompt: "course.being-a-student.16",
              answer: "b",
              choices: [
                {
                  id: "a",
                  label: "course.being-a-student.17",
                },
                {
                  id: "b",
                  label: "course.being-a-student.18",
                },
                { id: "c", label: "course.being-a-student.19" },
              ],
            },
            {
              id: "sg-3",
              kind: "choice",
              prompt: "course.being-a-student.20",
              answer: "c",
              choices: [
                {
                  id: "a",
                  label: "course.being-a-student.21",
                },
                {
                  id: "b",
                  label: "course.being-a-student.22",
                },
                {
                  id: "c",
                  label: "course.being-a-student.23",
                },
              ],
            },
            {
              id: "sg-4",
              kind: "choice",
              prompt: "course.being-a-student.24",
              answer: "b",
              choices: [
                {
                  id: "a",
                  label: "course.being-a-student.25",
                },
                {
                  id: "b",
                  label: "course.being-a-student.26",
                },
                { id: "c", label: "course.being-a-student.27" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "policies",
      title: "course.being-a-student.28",
      blocks: [
        {
          kind: "watch",
          id: "u2-policies-video",
          src: "https://drive.google.com/file/d/1N4dlZyuwX8yYLfLYxraif3h1BW6Hr9ki/view",
          title: "course.being-a-student.29",
          note: "course.being-a-student.30",
        },
        {
          kind: "read",
          id: "u2-policies-doc",
          optional: true,
          src: "/pdf/pa-english-program-policies-2026-ar.pdf",
          pages: 9,
          title: "course.being-a-student.31",
          note: "course.being-a-student.32",
        },
        {
          kind: "quiz",
          id: "u2-policies-quiz",
          title: "course.being-a-student.33",
          note: "course.being-a-student.34",
          questions: [
            {
              id: "pol-1",
              kind: "grid",
              prompt: "course.being-a-student.35",
              columns: [
                { id: "yes", label: "course.being-a-student.36" },
                { id: "no", label: "course.being-a-student.37" },
              ],
              rows: [
                {
                  id: "pol-1-a",
                  answer: "yes",
                  label: "course.being-a-student.38",
                },
                {
                  id: "pol-1-b",
                  answer: "yes",
                  label: "course.being-a-student.39",
                },
                {
                  id: "pol-1-c",
                  answer: "yes",
                  label: "course.being-a-student.40",
                },
              ],
            },
            {
              id: "pol-2",
              kind: "choice",
              prompt: "course.being-a-student.41",
              answer: "a",
              choices: [
                { id: "a", label: "course.being-a-student.42" },
                { id: "b", label: "course.being-a-student.43" },
                { id: "c", label: "course.being-a-student.44" },
                { id: "d", label: "course.being-a-student.45" },
              ],
            },
            {
              id: "pol-3",
              kind: "grid",
              prompt: "course.being-a-student.46",
              columns: [
                { id: "yes", label: "course.being-a-student.47" },
                { id: "no", label: "course.being-a-student.48" },
              ],
              rows: [
                {
                  id: "pol-3-a",
                  answer: "no",
                  label: "course.being-a-student.49",
                },
                {
                  id: "pol-3-b",
                  answer: "yes",
                  label: "course.being-a-student.50",
                },
                {
                  id: "pol-3-c",
                  answer: "yes",
                  label: "course.being-a-student.51",
                },
                {
                  id: "pol-3-d",
                  answer: "no",
                  label: "course.being-a-student.52",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "plagiarism",
      title: "course.being-a-student.53",
      blocks: [
        {
          kind: "watch",
          id: "u2-plagiarism-video",
          src: "https://drive.google.com/file/d/1mjQ_SDtGWT1nu5kdeYmvXNEAKHmysAMl/view",
          title: "course.being-a-student.54",
          note: "course.being-a-student.55",
        },
      ],
    },
    {
      id: "etiquette",
      title: "course.being-a-student.56",
      blocks: [
        {
          kind: "prose",
          body: "course.being-a-student.57",
        },
        {
          kind: "steps",
          ordered: true,
          items: [
            {
              text: "course.being-a-student.58",
              sub: [
                "course.being-a-student.59",
                "course.being-a-student.60",
              ],
            },
            {
              text: "course.being-a-student.61",
              sub: [
                "course.being-a-student.62",
                "course.being-a-student.63",
              ],
            },
            {
              text: "course.being-a-student.64",
              sub: [
                "course.being-a-student.65",
              ],
            },
            {
              text: "course.being-a-student.66",
              sub: [
                "course.being-a-student.67",
                "course.being-a-student.68",
              ],
            },
            {
              text: "course.being-a-student.69",
              sub: [
                "course.being-a-student.70",
              ],
            },
            {
              text: "course.being-a-student.71",
              sub: [
                "course.being-a-student.72",
                "course.being-a-student.73",
              ],
            },
          ],
        },
      ],
    },
  ],
};

const unitTechnology: Unit = {
  slug: "technology",
  order: 3,
  minutes: 30,
  title: "course.technology.1",
  summary: "course.technology.2",
  sections: [
    {
      id: "overview",
      title: "course.technology.3",
      blocks: [
        {
          kind: "prose",
          body: "course.technology.4",
        },
        {
          kind: "steps",
          title: "course.technology.5",
          items: [
            { text: "course.technology.6" },
            { text: "course.technology.7" },
            {
              text: "course.technology.8",
            },
          ],
        },
        {
          kind: "note",
          body: "course.technology.9",
        },
        {
          kind: "prose",
          body: "course.technology.10",
        },
        {
          kind: "prose",
          body: "course.technology.11",
        },
        {
          kind: "links",
          title: "course.technology.12",
          items: [
            {
              label: "course.technology.13",
              note: "course.technology.14",
              href: "https://www.timeanddate.com/worldclock/converter.html",
            },
          ],
        },
        {
          kind: "watch",
          id: "u3-meet-video",
          optional: true,
          src: "https://www.youtube.com/watch?v=7KVZvUxQXMA",
          title: "course.technology.15",
        },
        {
          kind: "watch",
          id: "u3-zoom-video",
          optional: true,
          src: "https://www.youtube.com/watch?v=fMUxzrgZvZQ",
          title: "course.technology.16",
        },
        {
          kind: "watch",
          id: "u3-gmail-star-video",
          optional: true,
          src: "https://www.youtube.com/watch?v=mbAi86-cSXw",
          title: "course.technology.17",
          note: "course.technology.18",
        },
      ],
    },
    {
      id: "equipment",
      title: "course.technology.19",
      blocks: [
        {
          kind: "prose",
          body: "course.technology.20",
        },
        {
          kind: "cards",
          items: [
            {
              tone: "accent",
              title: "course.technology.21",
              body: "course.technology.22",
            },
            {
              tone: "cool",
              title: "course.technology.23",
              body: "course.technology.24",
            },
          ],
        },
        {
          kind: "watch",
          id: "u3-gmail-video",
          src: "https://drive.google.com/file/d/1_CFefjYiZykEShDoL4-VILAtpSPoVyv1/view",
          title: "course.technology.25",
          note: "course.technology.26",
        },
        {
          kind: "watch",
          id: "u3-drive-video",
          src: "https://drive.google.com/file/d/1dhcSCpzoIc-MhOX6uHzT0_uLxePojVjP/view",
          title: "course.technology.27",
          note: "course.technology.28",
        },
      ],
    },
  ],
};

const unitCrossCultural: Unit = {
  slug: "cross-cultural",
  order: 4,
  minutes: 30,
  title: "course.cross-cultural.1",
  summary: "course.cross-cultural.2",
  sections: [
    {
      id: "intro",
      title: "course.cross-cultural.3",
      blocks: [
        {
          kind: "prose",
          body: "course.cross-cultural.4",
        },
      ],
    },
    {
      id: "resources",
      title: "course.cross-cultural.5",
      blocks: [
        {
          kind: "watch",
          id: "u4-part-1",
          src: "https://drive.google.com/file/d/1mzoefC8jubHqRA-7-e07PKqvapPFf946/view",
          title: "course.cross-cultural.6",
          note: "course.cross-cultural.7",
        },
        {
          kind: "watch",
          id: "u4-part-2",
          src: "https://drive.google.com/file/d/1t4EcTidodhJx_GLNtg_91QuiOtRyIzOt/view",
          title: "course.cross-cultural.8",
          note: "course.cross-cultural.9",
        },
        {
          kind: "watch",
          id: "u4-sample-lesson",
          src: "https://drive.google.com/file/d/1ffoL8mSPdWronS851ST5AA9sSIS39KIH/view",
          title: "course.cross-cultural.10",
          note: "course.cross-cultural.11",
        },
      ],
    },
  ],
};

const unitEnglishProgramme: Unit = {
  slug: "english-programme",
  order: 5,
  minutes: 25,
  title: "course.english-programme.1",
  summary: "course.english-programme.2",
  sections: [
    {
      id: "intro",
      title: "course.english-programme.3",
      blocks: [
        {
          kind: "prose",
          body: "course.english-programme.4",
        },
        {
          kind: "watch",
          id: "u5-programme-video",
          title: "course.english-programme.5",
          note: "course.english-programme.6",
        },
      ],
    },
    {
      id: "attendance",
      title: "course.english-programme.7",
      blocks: [
        {
          kind: "note",
          body: "course.english-programme.8",
        },
        {
          kind: "watch",
          id: "u5-attendance-video",
          src: "https://drive.google.com/file/d/1ih7fw9knk1bfE6UMw0z1xf4Gsf-pJffn/view",
          title: "course.english-programme.9",
          note: "course.english-programme.10",
        },
      ],
    },
  ],
};

const unitPlacementTest: Unit = {
  slug: "placement-test",
  order: 6,
  minutes: 60,
  title: "course.placement-test.1",
  summary: "course.placement-test.2",
  sections: [
    {
      id: "brief",
      title: "course.placement-test.3",
      blocks: [
        {
          kind: "prose",
          body: "course.placement-test.4",
        },
        {
          kind: "prose",
          body: "course.placement-test.5",
        },
        {
          kind: "note",
          body: "course.placement-test.6",
        },
      ],
    },
    {
      id: "exam",
      blocks: [{ kind: "exam", id: "u6-diagnostic", exam: diagnosticExam }],
    },
  ],
};

const unitNextSteps: Unit = {
  slug: "next-steps",
  order: 7,
  minutes: 15,
  title: "course.next-steps.1",
  summary: "course.next-steps.2",
  sections: [
    {
      id: "timeline",
      title: "course.next-steps.3",
      blocks: [{ kind: "prose", body: "course.next-steps.4" }],
    },
    {
      id: "completion",
      title: "course.next-steps.5",
      blocks: [
        { kind: "prose", body: "course.next-steps.6" },
        { kind: "prose", body: "course.next-steps.7" },
        { kind: "note", body: "course.next-steps.8" },
      ],
    },
    {
      id: "conduct",
      title: "course.next-steps.9",
      blocks: [
        { kind: "prose", body: "course.next-steps.10" },
        { kind: "prose", body: "course.next-steps.11" },
        {
          kind: "steps",
          ordered: true,
          title: "course.next-steps.12",
          items: [
            { text: "course.next-steps.13" },
            { text: "course.next-steps.14" },
            { text: "course.next-steps.15", sub: ["course.next-steps.16", "course.next-steps.17"] },
            { text: "course.next-steps.18" },
            { text: "course.next-steps.19" },
            { text: "course.next-steps.20" },
            { text: "course.next-steps.21" },
            { text: "course.next-steps.22" },
          ],
        },
      ],
    },
    {
      id: "reporting",
      title: "course.next-steps.23",
      blocks: [
        {
          kind: "steps",
          ordered: true,
          items: [{ text: "course.next-steps.24" }, { text: "course.next-steps.25" }, { text: "course.next-steps.26" }],
        },
        {
          kind: "steps",
          ordered: true,
          title: "course.next-steps.27",
          items: [{ text: "course.next-steps.28" }, { text: "course.next-steps.29" }],
        },
        {
          kind: "contacts",
          items: [
            {
              role: "course.next-steps.30",
              name: "Ibrahim Alaboud",
              email: "ibrahim@paper-airplanes.org",
              note: "course.next-steps.31",
            },
          ],
        },
      ],
    },
    {
      id: "sign",
      title: "course.next-steps.32",
      blocks: [
        { kind: "prose", body: "course.next-steps.33" },
        {
          kind: "agreement",
          id: "u7-code-of-conduct",
          title: "course.next-steps.34",
          note: "course.next-steps.35",
          statement: "course.next-steps.36",
        },
      ],
    },
  ],
};

export const units: Unit[] = [
  unitIntro,
  unitWhoWeAre,
  unitBeingAStudent,
  unitTechnology,
  unitCrossCultural,
  unitEnglishProgramme,
  unitPlacementTest,
  unitNextSteps,
];

export const unitsBySlug = new Map(units.map((unit) => [unit.slug, unit]));

export const readyUnits = units.filter((unit) => !unit.draft);

export function requiredBlocks(unit: Unit) {
  return unit.sections
    .flatMap((section) => section.blocks)
    .filter(
      (block) =>
        (block.kind === "read" && !block.optional) ||
        (block.kind === "watch" && !!block.src && !block.optional) ||
        block.kind === "quiz" ||
        block.kind === "exam" ||
        block.kind === "agreement",
    ) as TrackedBlock[];
}

export function unitQuizzes(unit: Unit) {
  return unit.sections
    .flatMap((section) => section.blocks)
    .filter((block) => block.kind === "quiz") as QuizBlock[];
}
