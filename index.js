const handlebars = require('handlebars');
const fs = require('fs');

const CV = "cv";
const RESUME = "resume";
let mode;
let badArgFormat = false;
if (process.argv.length === 3) {
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

class Replacer {
    constructor() {
        this.patterns = []
    }

    register(regex, replacer) {
        this.patterns.push({
            // ensure global replace
            regex: new RegExp(regex, 'g'),
            replacer
        });
    }

    modify(text) {
        for (const {regex, replacer} of this.patterns) {
            console.log(`replacing with ${regex}`);
            text = text.replace(regex, replacer);
        }
        return text;
    }
}

// create templates
function loadTemplate(path) {
    return handlebars.compile(fs.readFileSync(path, 'utf-8'));
}

handlebars.registerHelper('ifObject', function (item, options) {
    if (typeof item === "object") {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
const baseTemplate = loadTemplate('templates/base.hbs');
const datedTemplate = loadTemplate('templates/dated_content.hbs');
const listTemplate = loadTemplate('templates/list_content.hbs');
const inlineListTemplate = loadTemplate('templates/inline_list.hbs');

// partials
handlebars.registerPartial('highlight', loadTemplate('templates/highlight.hbs'));
handlebars.registerPartial('content', loadTemplate('templates/content.hbs'));


const FIRST_TEXT_MARGIN = em(2.2);
const AFTER_FIRST_TEXT_MARGIN = em(1.1);

class ContentSection {
    constructor(type, ...content) {
        Object.assign(this, {
            contentType         : type,
            afterFirstTextMargin: AFTER_FIRST_TEXT_MARGIN,
        }, ...content);

        // for lists, specify if it's a long list if any text is too long
        if (this.hasOwnProperty("pairs")) {
            Object.keys(this.pairs).forEach(key => {
                if (key.length + this.pairs[key].length > 50) {
                    this.long = true;
                }
            });
        }

        // TODO replace 0.8 with font size
        this.afterFirstDateMargin = em(0.8 + parseFloat(this.afterFirstTextMargin));
    }
}

const contact = {
    separator: "|",
    classes  : "subtitle",
    items    : [
        "<a href=\"http://johnsonzhong.me\">johnsonzhong.me</a>",
        "<a href=\"https://github.com/lemonpi\">github.com/lemonpi</a>",
        "<a href=\"https://scholar.google.com/citations?user=ttUbb1wAAAAJ&hl=en&authuser=1\">Google Scholar</a>",
        "zhsh@umich.edu",
    ]
};

const languages = new ContentSection("Languages", {
    pairs: {
        ""        : "Experience [> thousands of lines of code]",
        Python    : "100",
        "C++"     : "60",
        Javascript: "15",
        C         : "5",
    }
});

const education = new ContentSection("Education", {
    topDist: FIRST_TEXT_MARGIN,
    rows   : [
        {
            duration  : "2018-09 to now",
            title     : "<strong>University of Michigan</strong>",
            highlights: [
                {
                    desc: "PhD Candidate in Robotics under Dmitry Berenson",
                },
                "Cumulative GPA: 3.96/4.0",
            ]
        },
        {
            duration  : "2013-09 to 2018-06",
            title     : "<strong>University of Toronto</strong>",
            highlights: [
                {
                    desc     : "B.ASc in Engineering Science Robotics with high honours",
                    reference: {
                        link: "http://johnsonzhong.me/res/grad/degree.pdf",
                        text: "johnsonzhong.me/res/grad/degree.pdf",
                    },
                },
                "Cumulative GPA: 3.91/4.0",
                "Major GPA: 4.0/4.0",
                "<strong>Rank</strong> 2/161 in semester 5 | 5/158 in semester 6",
            ]
        }
    ]
});

const activities = {
    pytorch_kinematics: {
        duration  : "2021-01 to 2022-06",
        title     : "<strong>PyTorch Differentiable Robot Kinematics</strong>",
        caption   : "Open source library",
        reference : {
            link: "https://github.com/UM-ARM-Lab/pytorch_kinematics",
            text: "github.com/UM-ARM-Lab/pytorch_kinematics"
        },
        tools     : ["python", "PyTorch"],
        desc      : "Parallel and differentiable robot forward kinematics and Jacobian calculation",
        highlights: [
            ">150 stars",
            "Differentiable robot kinematics and Jacobian computation",
            "Load robot description from URDF, SDF, and MJCF formats",
        ]
    },
    mppi: {
        duration  : "2020-01 to 2022-03",
        title     : "<strong>PyTorch Model Predictive Path Integral Controller</strong>",
        caption   : "Open source library",
        reference : {
            link: "https://github.com/UM-ARM-Lab/pytorch_mppi",
            text: "github.com/UM-ARM-Lab/pytorch_mppi"
        },
        tools     : ["python", "PyTorch"],
        desc      : "Batched and GPU friendly implementation of Model Predictive Path Integral (MPPI) controller.",
        highlights: [
            ">200 stars",
            "Used by many university labs",
            "Handle stochastic dynamic models",
        ]
    },
    kepler: {
        duration  : "2018-05 to 2018-08",
        title     : "<strong>Kepler Communications Software Engineering Intern</strong>",
        caption   : "Summer internship, Toronto",
        reference : {
            link: "http://www.keplercommunications.com/",
            text: "keplercommunications.com"
        },
        tools     : ["python", "asyncio", "SQL"],
        desc      : "Kepler is a Toronto startup providing communication services with low earth orbit " +
                    "satellites. Challenges from this situation include communication opportunities " +
                    "being limited to when the satellite is above a ground station (a pass), and frequently " +
                    "dropped packets.",
        highlights: [
            "Designed and developed mission control backend for commanding and communicating with satellites to replace 3rd party software",
            "Scaled communication to potentially tens of satellites simultaneously",
            "Modularized architecture to allow for handling of any communication protocol without affecting interaction logic",
            "Allowed for task scheduling and progress saving across passes"
        ]
    },
    thesis: {
        duration  : "2017-09 to 2018-05",
        title     : "<strong>Magnetic Microbead Control for Intracellular Manipulation</strong> with Prof. Yu Sun",
        caption   : "Undergraduate Thesis at the Advanced Micro and Nanosystems Laboratory",
        tools     : ["MATLAB", "QT"],
        desc      : "The lab develops a cutting edge magnetic tweezer to manipulate nano-sized beads",
        highlights: [
            "Created simulation of the magnetic system",
            "Explored how practical constraints impacted controllable region",
            "Designed a learned gain scheduling controller to optimize controllable region",
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
        tools     : ["C++", "QT", "boost"],
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
        tools     : ["C++"],
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
        tools     : ["C++", "Arduino"],
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
            link: "http:/johnsonzhong.me/sal/",
            text: "johnsonzhong.me/sal/",
        },
        tools     : ["C++"],
        desc      : "Header only C++ template library with an interactive tester focused on implementation readability.",
        highlights: [
            "Implemented sets and maps with treaps to get <strong>4x insertion and 2x read</strong> time improvements over standard library",
        ]
    }

};

const researchExperience = new ContentSection("Research Projects", {
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

    researchExperience.rows = [activities.thesis, verityResearch, activities.fpga];
    // more work focus on resume
    activities.verity.desc += " I designed and implemented a robust parameters system.";
    activities.verity.highlights = [
        "Real time performance",
        "Parameter values smartly retained after adding/removing other parameters",
        "PC software can modify parameters on <strong>all hardware platforms and versions</strong> without recompilation",
        "Simplified usage so much that a coworker wrote: <a class='quote'>Tears of joy come to my eyes seeing how much simpler the code becomes</a>"
    ];
    workExperience.rows = [activities.kepler, activities.verity];
}

const funding = new ContentSection("Academic Funding", {
    topDist: FIRST_TEXT_MARGIN,
    afterFirstTextMargin: 0,
    rows   : [
        {
            duration: "2018-09 to 2019-09",
            desc    : "Robotics Institute Fellowship",
            dollar  : 75000
        },
        {
            duration: "2013-09 to 2018-05",
            desc    : "Shaw Admission Scholarship",
            dollar  : 20000
        },
        {
            duration: "2015-05",
            desc    : "Undergraduate Student Research Awards (USRA) " +
                      "grant from Natural Sciences and Engineering Research Council of Canada (NSERC)",
            dollar  : 6000
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
            duration : "2018-04",
            desc     : "Engineering Science Award of Excellence",
            reference: {
                link: "http://johnsonzhong.me/res/grad/award_of_excellence.pdf",
                text: "johnsonzhong.me/res/grad/award_of_excellence.pdf"
            }
        },
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

const conference = new ContentSection("Conference Publications", {
    topDist: FIRST_TEXT_MARGIN,
    rows   : [
        {
            duration: "2023-02",
            desc    : '<strong>S. Zhong</strong>, N. Fazeli, and D. Berenson, “CHSEL: Producing Diverse Plausible Pose Estimates from Contact and Free Space Data,” <em>RSS</em>, 2023.',
            reference: {
                link: "http://johnsonzhong.me/projects/chsel",
                text: "link",
            },
        },
    ]
});

const publications = new ContentSection("Journal Publications", {
    topDist: FIRST_TEXT_MARGIN,
    rows   : [
        // {
        //     duration: "2023-02",
        //     desc    : '<strong>S. Zhong</strong>, N. Fazeli, and D. Berenson, “CHSEL: Producing Diverse Plausible Pose Estimates from Contact and Free Space Data,” <em>RSS</em>, 2023.',
        //     reference: {
        //         link: "http://johnsonzhong.me/projects/chsel",
        //         text: "link",
        //     },
        // },
        {
            duration: "2022-01",
            desc    : '<strong>S. Zhong</strong>, N. Fazeli, and D. Berenson, “Soft Tracking Using Contacts for Cluttered Objects to Perform Blind Object Retrieval,” <em>RA-L</em>, 2022.',
            reference: {
                link: "http://johnsonzhong.me/projects/stucco",
                text: "link",
            },
        },
        {
            duration: "2021-02",
            desc    : '<strong>S. Zhong</strong>, Z. Zhang, N. Fazeli, and D. Berenson, “TAMPC: An Online Controller for Escaping Traps in Novel Environments,” <em>RA-L</em>, 2021.',
            reference: {
                link: "http://johnsonzhong.me/projects/tampc",
                text: "link",
            },
        },
        {
            duration: "2018-01",
            desc    : 'K. E. Murray, O. Petelin, <strong>S. Zhong</strong>, J. M. Wang, M. Eldafrawy, J.-P. Legault, E. Sha,A. G. Graham, J. Wu, M. J. P. Walker et  al., “Vtr 8: High-performance CAD and Customizable FPGA Architecture Modelling,” <em>TRETS</em>, 2020. <strong>Best Paper Award.</strong>',
            reference: {
                link: "http://dl.acm.org/doi/10.1145/3388617",
                text: "link",
            },
        }
    ]
});

const teaching = new ContentSection("Teaching Experience", {
    topDist: FIRST_TEXT_MARGIN,
    rows   : [
        {
            duration: "2022-07 to 2023-01",
            desc    : 'Graduate Student Instructor for ROB 502 Programming for Robotics (new course)',
            reference: {
                link: "https://web.eecs.umich.edu/~dmitryb/courses/fall2022pfr/index.html",
                text: "link",
            },
            highlights: [
                "Designed assignments, labs, and quizzes ",
                "Set up automated grading for assignments and quizzes ",
                "Led weekly 2 hour interactive labs ",
            ]
        },
    ]
});

const projects = new ContentSection("Projects", {
    topDist: FIRST_TEXT_MARGIN,
    rows   : [
        activities.pytorch_kinematics, activities.mppi, activities.aer201, activities.sal
    ]
});

const skills = new ContentSection("Software Skills", {
    pairs: {
        Specialities     : "Asynchronous programming, Parallelization",
        "Build tools"    : "CMake, Makefile, Catkin",
        "Version control": "Git, SVN",
        Environments     : "ROS, Linux, Web, Arduino",
        Libraries        : "PyTorch, numpy, cvxpy, Boost, QT, D3",
        Simulators       : "PyBullet, MuJoCo",
        "Code review"    : "Gerrit",
        Integration      : "Buildbot, Jenkins",
        Database         : "PostgreSQL, MySQL"
    }
});

const courses = new ContentSection("Courses", {
    pairs: {
        "Heavy focus" : "Control, Machine learning, Modelling, MPC",
        "Medium focus": "Perception, Kinematics, Probability, Algorithms",
        "Light focus" : "Economics, Marketing"
    }
});


const contactHtml = inlineListTemplate(contact);
const researchHtml = datedTemplate(researchExperience);
const educationHtml = datedTemplate(education);
const languageHtml = listTemplate(languages);
const fundingHtml = datedTemplate(funding);
const awardsHtml = datedTemplate(awards);
const publicationsHtml = datedTemplate(publications);
const conferenceHtml = datedTemplate(conference);
const projectsHtml = datedTemplate(projects);
const workHtml = datedTemplate(workExperience);
const skillsHtml = listTemplate(skills);
const coursesHtml = listTemplate(courses);
const teachingHtml = datedTemplate(teaching);

let html;
if (mode === CV) {
    html = baseTemplate({
        header : [
            contactHtml
        ],
        content: [
            educationHtml,
            publicationsHtml,
            conferenceHtml,
            fundingHtml,
            awardsHtml,
            researchHtml,
            teachingHtml,
            projectsHtml,
            languageHtml,
            skillsHtml,
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

rep = new Replacer();
rep.register(/(?<=[^./\d])([\d.]+)\/([\d.]+)/, function (match, numerator, denominator) {
    const replaced = `<a class="numerator">${numerator}</a><a class="denominator">${denominator}</a>`;
    console.log(`${match} replaced with ${replaced}`);
    return replaced;
});
html = rep.modify(html);

fs.writeFileSync(`web/${mode}.html`, html);
