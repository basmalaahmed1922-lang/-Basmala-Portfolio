// زر الوضع الليلي والنهاري
const themeButton = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("portfolio-theme");

function updateThemeButton() {
    const isLightMode = document.body.classList.contains("light-mode");
    const isArabic = document.documentElement.lang === "ar";

    themeButton.textContent = isLightMode ? "☀" : "☾";
    themeButton.setAttribute(
        "aria-label",
        isArabic
            ? (isLightMode ? "التبديل للوضع الليلي" : "التبديل للوضع النهاري")
            : (isLightMode ? "Switch to night mode" : "Switch to light mode")
    );
}

if (savedTheme === "light") {
    document.body.classList.add("light-mode");
}

themeButton.addEventListener("click", function () {
    document.body.classList.toggle("light-mode");

    const isLightMode = document.body.classList.contains("light-mode");
    localStorage.setItem("portfolio-theme", isLightMode ? "light" : "night");

    updateThemeButton();
});


// قائمة الموبايل
const menuButton = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuButton.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");
    const isArabic = document.documentElement.lang === "ar";

    menuButton.textContent = isOpen ? "×" : "☰";
    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute(
        "aria-label",
        isArabic
            ? (isOpen ? "إغلاق القائمة" : "فتح القائمة")
            : (isOpen ? "Close menu" : "Open menu")
    );
});

navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuButton.textContent = "☰";
        menuButton.setAttribute("aria-expanded", "false");
    });
});


// إظهار الأقسام أثناء النزول
const revealItems = document.querySelectorAll(
    "#about, #education, #skills, #projects, #contact, .skills-list span, .project-card, .timeline-item"
);

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealItems.forEach((item, index) => {
        item.classList.add("reveal");
        item.style.setProperty("--reveal-delay", `${(index % 3) * 100}ms`);
        revealObserver.observe(item);
    });
}


// شريط التقدم وزر الرجوع للأعلى
const scrollProgress = document.getElementById("scroll-progress");
const backToTopButton = document.getElementById("back-to-top");

function updateScrollProgress() {
    const pageHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress = pageHeight > 0
        ? (window.scrollY / pageHeight) * 100
        : 0;

    scrollProgress.style.width = `${progress}%`;

    if (window.scrollY > 300) {
        backToTopButton.classList.add("show");
    } else {
        backToTopButton.classList.remove("show");
    }
}

window.addEventListener("scroll", updateScrollProgress);
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

backToTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


// فلترة المشاريع
const filterButtons = document.querySelectorAll(".filter-button");
const projectItems = document.querySelectorAll(".project-item");

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const category = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        projectItems.forEach(function (project) {
            project.hidden =
                category !== "all" && category !== project.dataset.category;
        });
    });
});


// الكتابة المتحركة
let learningTopics = [
    "Linux",
    "Cybersecurity fundamentals",
    "Networking basics"
];

let topicIndex = 0;
let letterIndex = 0;
let isDeleting = false;

const typingText = document.getElementById("typing-text");

function typeLearningTopic() {
    const topic = learningTopics[topicIndex];
    typingText.textContent = topic.substring(0, letterIndex);

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && letterIndex === topic.length) {
        isDeleting = true;
        delay = 1200;
    } else if (isDeleting && letterIndex === 0) {
        isDeleting = false;
        topicIndex = (topicIndex + 1) % learningTopics.length;
        delay = 300;
    } else {
        letterIndex += isDeleting ? -1 : 1;
    }

    setTimeout(typeLearningTopic, delay);
}

typeLearningTopic();


// تمييز رابط القسم الحالي
const pageSections = document.querySelectorAll("main section[id]");
const pageNavLinks = document.querySelectorAll(".nav-links a");

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    pageNavLinks.forEach(function (link) {
                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === `#${entry.target.id}`
                        );
                    });
                }
            });
        },
        { rootMargin: "-30% 0px -60% 0px" }
    );

    pageSections.forEach((section) => sectionObserver.observe(section));
}


// نموذج التواصل يفتح برنامج البريد برسالة جاهزة
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    const name = document.getElementById("visitor-name").value.trim();
    const email = document.getElementById("visitor-email").value.trim();
    const message = document.getElementById("visitor-message").value.trim();
    const isArabic = document.documentElement.lang === "ar";

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    formStatus.textContent = isArabic
        ? "جارٍ فتح تطبيق البريد..."
        : "Opening your email app...";

    window.location.href =
        `mailto:basmala.ahmed.1922@gmail.com?subject=${subject}&body=${body}`;
});


// تفاصيل خطط المشاريع
const projectDialog = document.getElementById("project-dialog");
const projectDialogTitle = document.getElementById("project-dialog-title");
const projectDialogDetails = document.getElementById("project-dialog-details");
const closeProjectDialog = document.getElementById("close-project-dialog");

document.querySelectorAll(".details-button").forEach(function (button) {
    button.addEventListener("click", function () {
        const isArabic = document.documentElement.lang === "ar";

        projectDialogTitle.textContent =
            isArabic ? button.dataset.titleAr : button.dataset.titleEn;

        projectDialogDetails.textContent =
            isArabic ? button.dataset.detailsAr : button.dataset.detailsEn;

        projectDialog.showModal();
    });
});

closeProjectDialog.addEventListener("click", function () {
    projectDialog.close();
});

projectDialog.addEventListener("click", function (event) {
    if (event.target === projectDialog) {
        projectDialog.close();
    }
});


// نصوص اللغتين
const englishText = {
    nav: ["Home", "About", "Education", "Skills", "Projects", "Contact"],
    greeting: "Hi, I'm Basmala Ahmed",
    role: "Aspiring Cybersecurity Specialist",
    introduction: "I'm a student with a strong interest in technology, Linux, and cybersecurity.",
    learning: "Currently learning",
    contactMe: "Contact Me",
    aboutTitle: "About Me",
    aboutText: "I'm a student at Delta Higher Institute for Management and Accounting Information Systems. I'm interested in IT, Linux, and cybersecurity, and I'm continually developing my knowledge and skills in these areas. My future goal is to work at Dark Entry, Ibrahim Hegazy's company, and build a career in cybersecurity.",
    educationTitle: "Education & Learning Journey",
    education: [
        ["Education", "Delta Higher Institute for Management and Accounting Information Systems"],
        ["Currently Learning", "HTML, CSS, Linux fundamentals, networking, and cybersecurity basics."],
        ["Career Goal", "Build a career in cybersecurity and work at Dark Entry in the future."]
    ],
    skillsTitle: "My Skills",
    skills: ["HTML", "CSS", "Computer Fundamentals", "Linux (Learning)", "Cybersecurity (Learning)"],
    projectsTitle: "Projects I'm Planning",
    projectsIntro: "These are ideas for projects I plan to build while learning.",
    filters: ["All", "Web", "Linux", "Cybersecurity"],
    projects: [
        ["Personal Portfolio", "A planned personal website to introduce myself and my career interests.", "Planned", "View Plan"],
        ["Linux Learning Lab", "A future project to practice Linux commands and basic system administration.", "Planned", "View Plan"],
        ["Cybersecurity Notes", "A planned collection of notes about networking and cybersecurity fundamentals.", "Planned", "View Plan"]
    ],
    contactTitle: "Contact",
    formLabels: ["Your name", "Your email", "Your message"],
    formButton: "Prepare Email",
    footer: "© 2026 Basmala"
};

const arabicText = {
    nav: ["الرئيسية", "نبذة عني", "التعليم", "مهاراتي", "مشروعاتي", "تواصل"],
    greeting: "مرحبًا، أنا بسملة أحمد",
    role: "أطمح للتخصص في الأمن السيبراني",
    introduction: "أنا طالبة مهتمة بالتكنولوجيا وLinux والأمن السيبراني.",
    learning: "أتعلم حاليًا",
    contactMe: "تواصلي معي",
    aboutTitle: "نبذة عني",
    aboutText: "أنا طالبة في المعهد العالي للإدارة ونظم المعلومات المحاسبية بالدقهلية. أهتم بتكنولوجيا المعلومات وLinux والأمن السيبراني، وأسعى باستمرار إلى تطوير معرفتي ومهاراتي. هدفي في المستقبل هو العمل في شركة Dark Entry التابعة لإبراهيم حجازي وبناء مسيرة مهنية في الأمن السيبراني.",
    educationTitle: "التعليم ومسار التعلّم",
    education: [
        ["الدراسة", "المعهد العالي للإدارة ونظم المعلومات المحاسبية بالدقهلية"],
        ["أتعلم حاليًا", "HTML وCSS وأساسيات Linux والشبكات والأمن السيبراني."],
        ["هدفي المهني", "بناء مسيرة مهنية في الأمن السيبراني والعمل مستقبلًا في شركة Dark Entry."]
    ],
    skillsTitle: "مهاراتي",
    skills: ["HTML", "CSS", "أساسيات الكمبيوتر", "Linux (بتعلمه)", "الأمن السيبراني (بتعلمه)"],
    projectsTitle: "مشروعات أخطط لتنفيذها",
    projectsIntro: "دي أفكار لمشروعات أخطط لتنفيذها أثناء التعلم.",
    filters: ["الكل", "مواقع الويب", "Linux", "الأمن السيبراني"],
    projects: [
        ["الموقع الشخصي", "موقع أخطط لإنشائه للتدرب على HTML وCSS وتصميم المواقع المتجاوبة.", "مخطط له", "عرض الخطة"],
        ["معمل تعلم Linux", "مشروع تعليمي للتدرب على أوامر Linux وإدارة الملفات وأساسيات إدارة النظام.", "مخطط له", "عرض الخطة"],
        ["ملاحظات الأمن السيبراني", "مجموعة ملاحظات أخطط لجمعها عن الشبكات وأساسيات الأمن السيبراني.", "مخطط له", "عرض الخطة"]
    ],
    contactTitle: "تواصل معي",
    formLabels: ["اسمك", "بريدك الإلكتروني", "رسالتك"],
    formButton: "تجهيز البريد",
    footer: "© ٢٠٢٦ بسملة"
};


// شرح المهارات عند الضغط عليها
const skillDescriptions = {
    en: [
        "I use HTML to organize page content, such as headings, paragraphs, links, and sections.",
        "I use CSS to style pages, choose colors and fonts, and create responsive layouts.",
        "I am building my knowledge of computer basics, files, and operating systems.",
        "I am learning Linux commands, file management, and basic system administration.",
        "I am learning cybersecurity fundamentals, networking concepts, and safe computing practices."
    ],
    ar: [
        "أستخدم HTML لتنظيم محتوى الصفحة، مثل العناوين والفقرات والروابط والأقسام.",
        "أستخدم CSS لتنسيق الصفحات واختيار الألوان والخطوط وجعل التصميم مناسبًا للشاشات المختلفة.",
        "أطوّر معرفتي بأساسيات الكمبيوتر والملفات وأنظمة التشغيل.",
        "أتعلم أوامر Linux وإدارة الملفات وأساسيات إدارة الأنظمة.",
        "أتعلم أساسيات الأمن السيبراني ومفاهيم الشبكات والاستخدام الآمن."
    ]
};

let selectedSkillIndex = null;

function updateSkillDescription() {
    const description = document.getElementById("skill-description");
    const isArabic = document.documentElement.lang === "ar";

    if (selectedSkillIndex === null) {
        description.textContent = isArabic
            ? "اضغطي على أي مهارة لقراءة نبذة عنها."
            : "Click a skill to learn more about it.";
        return;
    }

    const language = isArabic ? "ar" : "en";
    description.textContent = skillDescriptions[language][selectedSkillIndex];
    description.classList.remove("updated");
    void description.offsetWidth;
    description.classList.add("updated");
}

document.querySelectorAll(".skills-list span").forEach(function (skill, index) {
    function selectSkill() {
        selectedSkillIndex = index;

        document.querySelectorAll(".skills-list span").forEach(function (item) {
            item.setAttribute("aria-pressed", "false");
        });

        skill.setAttribute("aria-pressed", "true");
        updateSkillDescription();
    }

    skill.addEventListener("click", selectSkill);

    skill.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectSkill();
        }
    });
});


// تغيير لغة الموقع وحفظ الاختيار
const languageButton = document.getElementById("language-toggle");

function changeLanguage(language) {
    const isArabic = language === "ar";
    const text = isArabic ? arabicText : englishText;
    const navHrefs = ["#home", "#about", "#education", "#skills", "#projects", "#contact"];

    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";

    navHrefs.forEach(function (href, index) {
        document.querySelector(`.nav-links a[href="${href}"]`).textContent =
            text.nav[index];
    });

    document.querySelector("#home h1").textContent = text.greeting;
    document.querySelector("#home h2").textContent = text.role;
    document.querySelector("#home .home-content > p:first-of-type").textContent =
        text.introduction;
    document.querySelector("#learning-label").textContent = text.learning;
    document.querySelector("#home .button").textContent = text.contactMe;

    document.querySelector("#about h2").textContent = text.aboutTitle;
    document.querySelector("#about p").textContent = text.aboutText;

    document.querySelector("#education h2").textContent = text.educationTitle;
    document.querySelectorAll(".timeline-item").forEach(function (item, index) {
        item.querySelector("h3").textContent = text.education[index][0];
        item.querySelector("p").textContent = text.education[index][1];
    });

    document.querySelector("#skills h2").textContent = text.skillsTitle;
    document.querySelectorAll(".skills-list span").forEach(function (skill, index) {
        skill.textContent = text.skills[index];
    });

    updateSkillDescription();

    document.querySelector("#projects h2").textContent = text.projectsTitle;
    document.querySelector("#projects > p").textContent = text.projectsIntro;

    document.querySelectorAll(".filter-button").forEach(function (button, index) {
        button.textContent = text.filters[index];
    });

    document.querySelectorAll("#projects .project-card").forEach(function (card, index) {
        card.querySelector("h3").textContent = text.projects[index][0];
        card.querySelector("p").textContent = text.projects[index][1];
        card.querySelector(".project-tag").textContent = text.projects[index][2];
        card.querySelector(".details-button").textContent = text.projects[index][3];
    });

    document.querySelector("#contact h2").textContent = text.contactTitle;
    document.querySelector('label[for="visitor-name"]').textContent = text.formLabels[0];
    document.querySelector('label[for="visitor-email"]').textContent = text.formLabels[1];
    document.querySelector('label[for="visitor-message"]').textContent = text.formLabels[2];
    document.querySelector('#contact-form button[type="submit"]').textContent =
        text.formButton;
    document.querySelector("footer p").textContent = text.footer;

    learningTopics = isArabic
        ? ["Linux", "أساسيات الأمن السيبراني", "أساسيات الشبكات"]
        : ["Linux", "Cybersecurity fundamentals", "Networking basics"];

    topicIndex = 0;
    letterIndex = 0;
    isDeleting = false;

    languageButton.textContent = isArabic ? "English" : "العربية";
    languageButton.setAttribute(
        "aria-label",
        isArabic ? "Switch to English" : "التبديل إلى العربية"
    );

    document.title = isArabic ? "بسملة | السيرة الشخصية" : "Basmala | Portfolio";
    localStorage.setItem("portfolio-language", language);
    updateThemeButton();
}

languageButton.addEventListener("click", function () {
    const nextLanguage =
        document.documentElement.lang === "en" ? "ar" : "en";

    changeLanguage(nextLanguage);
});

const savedLanguage = localStorage.getItem("portfolio-language") || "en";
changeLanguage(savedLanguage);