const headers="Подтверждение действий headers"
const subject="Подтверждение действий subj"
const text="Подтверждение действий text"

const html = (code:number)=>{
    return `
        <h2>Для подтверждения используйте ключ</h2>
        <h1>Ключ:${code}</h1>
    `;
}

export const mailBody = {
    html,
    headers,
    subject,
    text,
}