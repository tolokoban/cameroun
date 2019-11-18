export interface IVisit {
    /** Seconds since Epoc. */
    enter: number,
    data: {
        [key: string]: string
    }
}

export interface IAdmission {
    /** Seconds since Epoc. */
    enter: number,
    visits: IVisit[]
}

export interface IPatient {
    id: string,
    /** Seconds since Epoc. */
    created: number,
    /** Seconds since Epoc. */
    edited: number,
    data: {
        [key: string]: string | number | boolean
    },
    admissions: IAdmission[]
    vaccins: {},
    exams: [],
    picture: string | null,
    attachments: []
}
