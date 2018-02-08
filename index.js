const handlebars = require('handlebars');
const fs = require('fs');

const CV = "cv";
const RESUME = "resume";
let mode;
let badArgFormat = false;
if (process.argv.length == 3) {
    mode = process.argv[2].trim();
} else {
    badArgFormat = true;
}
if (badArgFormat || (mode !== CV && mode !== RESUME)) {
    console.log(`supply mode as one of [${CV}, ${RESUME}]`);
    process.exit(1);
}

function em(num) {
    if (String.prototype.endsWith.call(num, "em")) {
        return num;
    }
    return num + "em";
}

const FIRST_TEXT_MARGIN = em(2.2);
const AFTER_FIRST_TEXT_MARGIN = em(1.1);

class ContentSection {
    constructor(type, ...content) {
        Object.assign(this, {
            contentType         : type,
            afterFirstTextMargin: AFTER_FIRST_TEXT_MARGIN,
        }, ...content);

        // TODO replace 0.8 with font size
        this.afterFirstDateMargin = em(0.8 + parseFloat(this.afterFirstTextMargin));
    }
}

const contact = {
    separator: "|",
    classes  : "subtitle",
    items    : [
        "Legal name: Sheng",
        "<a href=\"http://johnsonzhong.me\">johnsonzhong.me</a>",
        "<a href=\"https://github.com/lemonpi\">github.com/lemonpi</a>",
        "johnson9510@hotmail.com",
    ]
};

const languages = new ContentSection("Languages", {
    pairs: {
        ""        : "Experience [> thousands lines of code]",
        "C++"     : "50",
        Javascript: "10",
        Python    : "5",
        C         : "5",
    }
});

const education = new ContentSection("Education", {
    topDist: FIRST_TEXT_MARGIN,
    rows   : [
        {
            duration  : "2013-09 to 2018-06",
            title     : "<strong>University of Toronto</strong>",
            highlights: [
                "B.ASc in Engineering Science Robotics",
                "Cumulative GPA: <i>3.92/4.0</i>",
                "Major GPA: <i>4.0/4.0</i>",
                "<strong>Rank 2</strong>/161 in 3rd year",
            ]
        }
    ]
});

const activities = {
    thesis: {
        duration  : "2017-09 to 2018-05",
        title     : "<strong>Magnetic Microbead Control for Intracellular Manipulation</strong> with Prof. Yu Sun",
        caption   : "Undergraduate Thesis at the Advanced Micro and Nanosystems Laboratory",
        desc      : "Project plan is to:",
        highlights: [
            "Create simulation of the magnetic system",
            "Adapt controllers to a lower visual feedback frequency (30Hz to 4Hz)",
            "Design a controller to simultaneously control multiple beads to enable twist manipulation",
        ]
    },
    verity: {
        duration  : "2016-05 to 2017-09",
        title     : "<strong>Verity Studios R&D Engineering Intern</strong> with Prof. Raffaello D'Andrea",
        caption   : "16 months Professional Experience Year, Zurich",
        reference : {
            link: "http://veritystudios.com",
            text: "veritystudios.com"
        },
        desc      : "Verity Studios is an ETH spinoff specializing in indoor drone show systems.",
        highlights: [
            "Modelled novel indoors localization system using physics first principles",
            "Enabled optimization of flight performance",
            "Achieved <strong>correlation of 0.86</strong> (95% confidence >0.80) against experimental performance",
        ]
    },
    fpga  : {
        duration  : "2015-05 to 2015-09",
        title     : "<strong>FPGA CAD Routing Optimization</strong> with Prof. Vaughn Betz",
        caption   : "Summer research with USRA NSERC 5k grant, University of Toronto",
        reference : {
            link: "http://johnsonzhong.me/projects/vpr",
            text: "johnsonzhong.me/projects/vpr",
        },
        desc      : "Verilog-to-Routing (VTR) is a CAD flow mapping Verilog to FPGAs. " +
                    "Its runtime performance was bottlenecked by the routing phase for large circuits.",
        highlights: [
            "Developed route tree pruning algorithm to allow incremental reroutes, " +
            "speeding up routing by up to <strong>3x</strong> on difficult benchmarks",

            "Designed targeted rerouting algorithm for critical yet suboptimal connections, " +
            "producing up to <strong>30% faster</strong> resulting circuits (maximum frequency)",

            "Benchmarked over realistic circuits, with speedups scaling with circuit size",
        ]
    },
    aer201: {
        duration  : "2015-09 to 2015-11",
        title     : "<strong>Autonomous Cooperating Robots</strong>",
        caption   : "AER201 Design Project in a team of 3",
        reference : {
            link: "http://johnsonzhong.me/projects/robot/",
            text: "johnsonzhong.me/projects/robot/",
        },
        desc      : "The task was to design and build a mobile robot to play connect-4 on " +
                    "a semi-randomized game board. We decided to pursue a two robots approach, " +
                    "one for retrieving the ball and one for playing the ball.",
        highlights: [
            "Targeted randomly placed high-reward ball dispensers to obtain " +
            "<strong>fastest ball retrieval time</strong> (3 ball/min vs average 0.5 ball/min)",
        ]
    },
    sal   : {
        duration  : "2014-11 to 2015-09",
        title     : "<strong>Simple Algorithms and Data Structures Library</strong>",
        caption   : "Open source personal project",
        reference : {
            link: "http://johnsonzhong.me/sal/",
            text: "johnsonzhong.me/sal/",
        },
        desc      : "Header only C++ template library with an interactive tester focused on implementation readability.",
        highlights: [
            "Implemented sets and maps with treaps to get <strong>4x insertion and 2x read</strong> time improvements over standard library",
        ]
    }

};

const researchExperience = new ContentSection("Research Experience", {
    topDist: FIRST_TEXT_MARGIN,
});

const workExperience = new ContentSection("Work Experience", {
    topDist: FIRST_TEXT_MARGIN,
});

if (mode === CV) {
    researchExperience.rows = [activities.thesis, activities.verity, activities.fpga];
} else {
    const verityResearch = Object.assign({}, activities.verity);
    verityResearch.desc = "";

    researchExperience.rows = [verityResearch, activities.fpga];
    // more work focus on resume
    activities.verity.desc += " I designed and implemented a robust parameters system.";
    activities.verity.highlights = [
        "Real time performance",
        "Parameter values smartly retained after adding/removing other parameters",
        "PC software can modify parameters on <strong>all hardware platforms and versions</strong> without recompilation",
        "Simplified usage so much that a coworker wrote: <a class='quote'>Tears of joy come to my eyes seeing how much simpler the code becomes</a>"
    ];
    workExperience.rows = [activities.verity];
}

const funding = new ContentSection("Funding Awarded", {
    topDist: FIRST_TEXT_MARGIN,
    rows   : [
        {
            duration: "2015-05",
            desc    : "Undergraduate Student Research Awards (USRA) " +
                      "grant from Natural Sciences and Engineering Research Council of Canada (NSERC)",
            dollar  : 6000
        }
    ]
});

const honours = new ContentSection("Academic Honours", {
    topDist             : FIRST_TEXT_MARGIN,
    afterFirstTextMargin: 0,
    rows                : [
        {
            duration: "2013-09 to 2018-05",
            desc    : "Shaw Admission Scholarship",
            dollar  : 20000
        },
        {
            duration: "2013-09",
            desc    : "Walter Scott Guest Memorial Scholarship",
            dollar  : 5000
        },
    ]
});

const awards = new ContentSection("Awards", {
    topDist             : FIRST_TEXT_MARGIN,
    afterFirstTextMargin: 0,
    rows                : [
        {
            duration: "2018-01",
            desc    : "3rd in Ontario Engineering Competition 2018 Programming category",
            dollar  : 500,
        },
        {
            duration : "2016-03",
            desc     : "<strong>1st</strong> in Ontario Engineering 2016 Competition Programming category",
            dollar   : 2000,
            reference: {
                link: "http://johnsonzhong.me/projects/snowfun/",
                text: "johnsonzhong.me/projects/snowfun",
            },
        },
        {
            duration : "2015-10",
            desc     : "<strong>1st</strong> in Canada in IEEEXtreme 9.0 (28/6800 globally)",
            reference: {
                link: "http://johnsonzhong.me/res/ieee9.pdf",
                text: "johnsonzhong.me/res/ieee9.pdf",
            },
        },
        {
            duration : "2015-01",
            desc     : "Context.io API prize in PennApps Winter 2015",
            dollar   : 500,
            reference: {
                link: "https://devpost.com/software/snowball",
                text: "devpost.com/software/snowball",
            },
        },
        {
            duration : "2014-10",
            desc     : "8th in Canada in IEEEXtreme 8.0 (52/6500 globally)",
            reference: {
                link: "http://johnsonzhong.me/res/ieee8.pdf",
                text: "johnsonzhong.me/res/ieee8.pdf",
            },
        },
        {
            duration : "2014-09",
            desc     : "Google Cloud Platform prize in Hack the North 2015",
            dollar   : 1000,
            reference: {
                link: "https://devpost.com/software/forenships",
                text: "devpost.com/software/forenships",
            },
        },
        {
            duration : "2013-10",
            desc     : "6th in Canada in IEEEXtreme 7.0 (43/7500 globally)",
            reference: {
                link: "http://johnsonzhong.me/res/ieee.jpg",
                text: "johnsonzhong.me/res/ieee.jpg",
            },
        },
    ]
});

const publications = new ContentSection("Publications", {
    topDist: FIRST_TEXT_MARGIN,
    rows   : [
        {
            duration: "2018-01",
            desc    : 'Kevin Murray, Oleg Petelin, Jason Luu, Sheng Zhong, ' +
                      'Jia Min Wang, Eugene Sha, Ken Kent, Vaughn Betz. ' +
                      '"VTR 8.0: Highly Customizable FPGA Architecture Evaluation and CAD." ' +
                      'To be submitted to ACM Transactions on Reconfigurable Technology and Systems.',
        }
    ]
});

const projects = new ContentSection("Projects", {
    topDist: FIRST_TEXT_MARGIN,
    rows   : [
        activities.aer201, activities.sal
    ]
});

const skills = new ContentSection("Software Skills", {
    pairs: {
        "Build tools"    : "CMake, Makefile",
        "Version control": "Git, SVN",
        Environments     : "Windows, Linux, Arduino",
        Libraries        : "Boost, QT",
        "Code review"    : "Gerrit",
        Integration      : "Buildbot, Jenkins"
    }
});

const courses = new ContentSection("Courses", {
    pairs: {
        "Heavy focus" : "Control theory, Machine learning, Modelling",
        "Medium focus": "Dynamics, Kinematics, Probability, Algorithms",
        "Light focus" : "Economics, Marketing"
    }
});

function loadTemplate(path) {
    return handlebars.compile(fs.readFileSync(path, 'utf-8'));
}

const baseTemplate = loadTemplate('templates/base.html');
const datedTemplate = loadTemplate('templates/dated_content.html');
const listTemplate = loadTemplate('templates/list_content.html');
const inlineListTemplate = loadTemplate('templates/inline_list.html');

const contactHtml = inlineListTemplate(contact);
const researchHtml = datedTemplate(researchExperience);
const educationHtml = datedTemplate(education);
const languageHtml = listTemplate(languages);
const fundingHtml = datedTemplate(funding);
const honoursHtml = datedTemplate(honours);
const awardsHtml = datedTemplate(awards);
const publicationsHtml = datedTemplate(publications);
const projectsHtml = datedTemplate(projects);
const workHtml = datedTemplate(workExperience);
const skillsHtml = listTemplate(skills);
const coursesHtml = listTemplate(courses);

let html;
if (mode === CV) {
    html = baseTemplate({
        header : [
            contactHtml
        ],
        content: [
            educationHtml,
            researchHtml,
            fundingHtml,
            honoursHtml,
            awardsHtml,
            publicationsHtml,
            projectsHtml,
            languageHtml
        ]
    });
} else {
    html = baseTemplate({
        header : [
            contactHtml
        ],
        content: [
            educationHtml,
            workHtml,
            researchHtml,
            awardsHtml,
            languageHtml,
            projectsHtml,
            skillsHtml,
            coursesHtml
        ]
    });
}
fs.writeFileSync(`web/${mode}.html`, html);
