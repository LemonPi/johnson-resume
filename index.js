const handlebars = require('handlebars');
const fs = require('fs');


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

const contact = new ContentSection("Contact", {
    pairs: {
        "Legal Name": "Sheng",
        Website     : "<a href=\"http://johnsonzhong.me\">johnsonzhong.me</a>",
        Email       : "sh.zhong@mail.utoronto.ca",
        Github      : "<a href=\"https://github.com/lemonpi\">github.com/lemonpi</a>",
    }
});

const languages = new ContentSection("Languages", {
    pairs: {
        ""        : "Experience [> lines of code]",
        "C++"     : "50k",
        Javascript: "10k",
        Python    : "5k",
        C         : "5k",
        Java      : "2k",
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
                "Cumulative GPA: <i>3.91/4.0</i>",
                "Major GPA: <i>4.0/4.0</i>",
                "<strong>Rank 2</strong>/161 in 3rd year",
            ]
        }
    ]
});

const researchExperience = new ContentSection("Research Experience", {
    topDist: FIRST_TEXT_MARGIN,
    rows   : [
        {
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
        {
            duration  : "2016-05 to 2017-09",
            title     : "<strong>Verity Studios R&D Engineering Intern</strong> with Prof. Raffaello D'Andrea",
            caption   : "16 months Professional Experience Year, Zurich",
            reference : {
                link: "http://veritystudios.com",
                text: "veritystudios.com"
            },
            desc      : "Verity Studios is an ETH spinoff specializing in indoor drone show systems",
            highlights: [
                "Modelled localization system that gave position updates to drones",
                "Estimated localization performance at any point inside any hypothetical flight space",
                "Achieved <strong>0.86 correlation with 95% confidence of >0.8</strong> against real performance",
                "Designed model for computational efficiency and suitability as a cost function",
                "Designed and implemented cross-platform parameters framework",
                "Parameters retained stored values intelligibly after firmware updates",
            ]
        },
        {
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
        }
    ]
});

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
            duration : "2016-03",
            desc     : "<strong>1st</strong> in Ontario Engineering Competition Programming category",
            dollar   : 2000,
            reference: {
                link: "http://johnsonzhong.me/projects/snowfun/",
                text: "johnsonzhong.me/projects/snowfun",
            },
        },
        {
            duration : "2015-10",
            desc     : "<strong>1st</strong> in Canada in IEEEXtreme 9.0 (28/6800 globally)",
            dollar   : 2000,
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

const baseTemplate = handlebars.compile(fs.readFileSync('templates/base.html', 'utf-8'));
const datedTemplate = handlebars.compile(fs.readFileSync('templates/dated_content.html',
    'utf-8'));
const listTemplate = handlebars.compile(fs.readFileSync('templates/list_content.html', 'utf-8'));

const researchHtml = datedTemplate(researchExperience);
const educationHtml = datedTemplate(education);
const contactHtml = listTemplate(contact);
const languageHtml = listTemplate(languages);
const fundingHtml = datedTemplate(funding);
const honoursHtml = datedTemplate(honours);
const awardsHtml = datedTemplate(awards);

const html = baseTemplate({
    content: [
        contactHtml,
        educationHtml,
        researchHtml,
        fundingHtml,
        honoursHtml,
        awardsHtml,
        languageHtml
    ]
});
fs.writeFileSync('web/cv.html', html);
