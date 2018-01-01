const handlebars = require('handlebars');
const fs = require('fs');


function em(num) {
    if (String.prototype.endsWith.call(num, "em")) {
        return num;
    }
    return num + "em";
}

const FIRST_TEXT_MARGIN = em(2.4);
const AFTER_FIRST_TEXT_MARGIN = em(1.1);
const AFTER_FIRST_DATE_MARGIN = em(2);

class ContentSection {
    constructor(...content) {
        Object.assign(this, ...content, {
            AFTER_FIRST_TEXT_MARGIN,
            AFTER_FIRST_DATE_MARGIN,
        });
    }
}

const education = new ContentSection({
    contentType: "Education",
    topDist    : FIRST_TEXT_MARGIN,
    rows       : [
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

const researchExperience = {
    contentType: "Research Experience",
    AFTER_FIRST_DATE_MARGIN,
    AFTER_FIRST_TEXT_MARGIN,
    topDist    : FIRST_TEXT_MARGIN,
    rows       : [
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
        }
    ]
};

const baseTemplate = handlebars.compile(fs.readFileSync('templates/base.html', 'utf-8'));
const contentTemplate = handlebars.compile(fs.readFileSync('templates/content_section.html',
    'utf-8'));

const researchHtml = contentTemplate(researchExperience);
const educationHtml = contentTemplate(education);
console.log(researchHtml);

const html = baseTemplate({content: [educationHtml, researchHtml]});
fs.writeFileSync('web/cv.html', html);
