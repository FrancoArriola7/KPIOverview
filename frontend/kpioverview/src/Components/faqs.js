export const faqs = [
    { 
        question: "What types of files can I upload to the projects?", 
        answer: "You can upload files containing tabular data, such as Excel or CSV formats. These files must include at least the mandatory columns." 
    },
    { 
        question: "What are the mandatory columns, and why are they necessary?", 
        answer: "The mandatory columns contain basic information about sites and cells. Such as 'Date,' 'eNodeB Name,' 'Cell FDD TDD Indication,' 'Cell Name,' 'LocalCell Id,' 'eNodeB Function Name,' and 'Integrity.' Additional columns can represent the KPIs you want to measure. They are necessary to ensure that the data can be processed correctly and that accurate KPI charts can be generated." 
    },
    { 
        question: "What happens if my file doesn't have all the mandatory columns?", 
        answer: "If a file doesn't contain all the mandatory columns, you won't be able to upload it. Make sure that all the required columns are present and correctly labeled before attempting to upload the file." 
    },
    { 
        question: "How can I add custom KPIs to my charts?", 
        answer: "You can add custom KPIs by including new columns in the file you upload. These columns should come after the mandatory columns. The KPIs will automatically be recognized and visualized in the project's Dashboard tab." 
    },
    { 
        question: "How are charts generated in the Dashboard tab?", 
        answer: "Charts are automatically generated using the data from the columns you upload in the project files. The KPIs defined in the additional columns will be used to create charts that visualize the performance of the sites based on those indicators." 
    },
    { 
        question: "Can I modify KPIs after uploading a file?", 
        answer: "Currently, KPIs are defined at the time of file upload, based on the additional columns you include. If you want to modify the KPIs, you will need to upload a new file with the desired changes." 
    },
    { 
        question: "What happens if the data in my file is incorrect or incomplete?", 
        answer: "If the data in your file is incorrect or incomplete, the generated charts may not accurately reflect KPI performance. Be sure to review and clean your data before uploading the file." 
    },
    { 
        question: "How can I visualize specific site or cell data?", 
        answer: "In the Dashboard tab, you can filter and select specific sites or cells to view their data in the charts. This allows you to focus on the most relevant KPIs for those entities." 
    },
    { 
        question: "Can I share projects with other users?", 
        answer: "Yes, you can share your projects with other users. But to do this, you will need to add them to your project." 
    },
    { 
        question: "What should I do if I have problems uploading a file or generating charts?", 
        answer: "If you encounter issues uploading a file or visualizing charts, first check that the file meets the requirements mentioned in the FAQs. If the problem persists, you can open a support ticket to receive further assistance." 
    }
];