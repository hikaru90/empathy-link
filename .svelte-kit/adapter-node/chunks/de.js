const menu = {
  title: "Menü",
  profile: {
    account: "Mein Account",
    logout: "Ausloggen",
    sheet: {
      header: "Profil"
    }
  },
  bar: {
    home: "Dashboard",
    selfempathy: "Selbstempathie",
    fights: "Streit",
    feedback: "Feedback",
    learn: "Lernen"
  },
  soon: "bald",
  share: {
    cta: "Teilen",
    copyLink: "Link kopieren",
    copyLinkConfirmation: "Link in Zwischenablage kopiert",
    mailLink: "Link verschicken",
    mailLinkConfirmation: "Link erfolgreich verschickt",
    mailLinkError: "Fehler beim versenden des Links",
    mailDialogText: "Mit wem möchtest Du streiten?"
  },
  sections: {
    the4steps: "Die 4 Schritte",
    modules: "Module",
    selfempathy: "Selbstempathie",
    fight: "Streit",
    feedback: "Feedback",
    learn: "Lernen"
  }
};
const page = {
  respond: {
    explanationTitle: "Erklärung",
    explanation: "Ein Empathie-Link ist ein digitales Kommunikationstool, das Empathie, ehrlichen Ausdruck und gegenseitiges Verständnis betont. Es konzentriert sich darauf, Gefühle und Bedürfnisse ohne Bewertung oder Schuldzuweisung zu identifizieren und auszudrücken, mit dem Ziel, mitfühlende Verbindungen herzustellen und Konflikte friedlich zu lösen.",
    steps: {
      greeting: {
        heading: "hat Dir einen Empathie-Link geschickt",
        explanationCta: "Was ist ein Empathie-Link?",
        question: "Fühlst Du Dich bereit ihn zu öffnen?"
      },
      disclaimer: {
        heading: "Denk daran",
        description: "Die Sachen die Du gleich liest, haben nichts mit Dir zu tun."
      },
      breathe: {
        heading: "Atme ein und aus"
      },
      ownerObservation: {
        heading: "hat folgende Beobachtung gemacht"
      },
      ownerFeelings: {
        heading: "hat sich so gefühlt"
      },
      ownerNeeds: {
        heading: "hat folgende Bedürfnisse"
      },
      ownerRequest: {
        heading: "hat folgende Bitte"
      },
      pause: {
        heading: "Du hast jetzt die Möglichkeit zu antworten"
      },
      success: {
        heading: "Geschafft"
      },
      error: {
        heading: "Leider ist bei der Antwort ein Fehler aufgetreten. Bitte versuche es nochmal. Falls das Problem weiterhin bestehen sollte, kontaktiere uns unter support@empathie-link.de"
      }
    }
  },
  home: {
    title: "Startseite",
    nav: "Start",
    hero: "Verbinde Dich trotz Stress und Hektik mit den Menschen, die Dir wichtig sind.",
    cta: "Verbinde Dich",
    components: {
      the4steps: {
        heading: "In 4 Schritten mit Dir selbst und anderen in Verbindung  kommen",
        steps: {
          observation: {
            heading: "Beobachten",
            text: "Beschreibe objektiv, was du wahrnimmst, ohne zu bewerten oder zu urteilen."
          },
          feelings: {
            heading: "Fühlen",
            text: "Teile mit, welche Emotionen durch die Beobachtung ausgelöst wurden."
          },
          needs: {
            heading: "Bedürfnisse erkennen",
            text: "Erkläre, welche Bedürfnisse hinter deinen Gefühlen stehen."
          },
          request: {
            heading: "Bitten",
            text: "Formuliere eine klare, konkrete Bitte, um deine Bedürfnisse zu erfüllen."
          }
        },
        cta: {
          link: "#",
          target: "_self",
          text: "Mehr über die 4 Schritte erfahren"
        }
      },
      modules: {
        heading: "4 App-Module für mehr Achtsamkeit",
        modules: {
          selfempathy: "Selbstempathie",
          fight: "Streit",
          feedback: "Feedback",
          learn: "Lernen"
        }
      },
      selfempathy: {
        heading: "Selbstempathie",
        description: "Jeder ist sich selbst der Nächste. Deshalb ist es wichtig sich darüber bewusst zu werden was man denkt, fühlt, braucht und will. Anhand der 4 Schritte kannst Du Dir in regelmäßigen abständen Selbstempathie geben und Veränderungen über die Zeit tracken."
      },
      fight: {
        heading: "Streiten wie ein Profi",
        description: "",
        steps: {
          observation: "Beobachtung",
          feelings: "Gefühle",
          needs: "Bedürfnisse",
          request: "Bitte"
        }
      },
      feedback: {
        heading: "Feedback",
        description: "Feedback zielt selten darauf ab zwischenmenschliche Bindungen wirklich zu stärken. Gerade im beruflichen Kontext ist es oft schwer sich aufrichtiges und Feedback zu geben. Doch durch die Einhaltung der 4 Schritte, gelingt auch dieses Kunststück.",
        steps: {
          observation: "Feedback geben, das auf der Wirklichkeit beruht",
          feelings: "Ehrliche Botschaften für eine echte Verbindung",
          needs: "Stärkere Beziehungen durch das Teilen von Bedürfnissen",
          request: "Bessere Performance durch lösungsorientierte Bitten"
        }
      },
      learn: {
        heading: "Lernen",
        description: "Empathie-Link beruht auf der Gewaltfreien Kommunikation nach Marshall Rosenberg. Mit ihr kann man sich ungelogen ein Leben lang beschäftigen. Deshalb lohnt es sich umso mehr, stets dazuzulernen. Im Lernbereich der App werden — ansonsten nur oberflächlich angeschnittene — Konzepte erklärt."
      }
    }
  },
  dashboard: {
    selectDate: "Zeitraum wählen",
    fights: {
      tableCaption: "Streit",
      endReached: "Ende erreicht",
      table: {
        id: "Id",
        partner: "Streitpartner",
        date: "Datum",
        opened: "Geöffnet",
        round: "Runde"
      }
    },
    feelings: {
      heading: "Gefühle",
      positive: "positiv",
      negative: "negativ",
      empty: "Keine Gefühle"
    },
    needs: {
      heading: "Bedürfnisse",
      selfcentered: "ich",
      community: "gemeinschaft",
      empty: "Keine Bedürfnisse"
    }
  },
  fight: {
    heading: "Streit",
    title: "Übersicht",
    card: {
      observation: "Beobachtung",
      feelings: "Gefühle",
      needs: "Bedürfnisse",
      request: "Bitte"
    },
    create: {
      info: "Ich habe zuerst ein paar allgemeine Fragen zu Deinem Streit.",
      observation: "Beschreibe was passiert ist. Ohne zu werten. Und ohne Unterstellungen oder Übertreibungen.",
      feelings: "Wie hast Du Dich dabei gefühlt?",
      needs: "Welche Bedürfnisse stecken dahinter?",
      request: "Um diesen Konflikt gut zu lösen, ist es wichtig, dass Du Dich verstanden fühlst. Ich werde Deine*n Streitpartner*in Bitten wiederzugeben was er/sie verstanden hat. \nMöchtest Du noch um etwas anderes bitten?",
      success: "Geschafft. Du kannst den Streitlink nun gerne mit Deinem oder Deiner Streitpartner*in teilen.",
      error: "Leider ist bei der Erstellung des Streits ein Fehler aufgetreten. Bitte versuche es nochmal. Falls das Problem weiterhin bestehen sollte, kontaktiere uns unter support@empathie-link.de"
    }
  },
  fights: {
    create: "Fang einen Streit an",
    loadMore: "Mehr laden",
    form: {
      general: {
        prev: "zurück",
        next: "Weiter",
        yes: "Ja",
        knowledge: "Ich weiß",
        checkJudgement: "Beobachtung überprüfen",
        steps: {
          info: "Infos",
          observation: "Beobachtung",
          feelings: "Gefühle",
          needs: "Bedürfnisse",
          request: "Bitte",
          success: "Erfolg"
        },
        badFeelings: "Negative Gefühle",
        goodFeelings: "Positive Gefühle",
        positiveNeeds: "Wenn unsere Bedürfnisse erfüllt sind",
        negativeNeeds: "Wenn unsere Bedürfnisse nicht erfüllt sind"
      },
      name: {
        label: "Wie heißt die Person, mit der Du Dich streiten möchtest?",
        tooShortError: "Der Name muss mindestens 3 Zeichen lang sein"
      },
      title: {
        label: "Welchen Titel würdest Du dem Streit geben?",
        tooShortError: "Der Titel muss mindestens 3 Zeichen lang sein"
      },
      observation: {
        label: "Was hast Du beobachtet?",
        tooShortError: "Deine Beobachtung sollte mindestens 10 Zeichen lang sein"
      },
      feelings: {
        label: "Wie fühlst Du Dich?",
        tooFewError: "Du solltest mindestens ein Gefühl auswählen"
      },
      needs: {
        label: "Welche Bedürfnisse stecken dahinter?",
        tooFewError: "Du solltest mindestens ein Bedürfnis auswählen"
      },
      request: {
        label: "Was ist Deine Bitte?",
        tooFewError: "Deine Bitte sollte mindestens 10 Zeichen lang sein"
      }
    }
  },
  login: {
    heading: "Login",
    text: "Jetzt anmelden",
    form: {
      email: {
        label: "E-Mail",
        validEmailError: "Die E-Mail muss gültig sein",
        tooShortError: "Die E-Mail muss mindestens 3 Zeichen enthalten",
        tooLongError: "Die E-Mail darf maximal 30 Zeichen enthalten"
      },
      password: {
        label: "Passwort",
        tooShortError: "Das Passwort muss mindestens 6 Zeichen enthalten",
        tooLongError: "Das Password darf maximal 30 Zeichen lang sein"
      }
    },
    cta: "Einloggen",
    toasts: {
      error: "Fehler beim Login, versuch es bitte noch einmal",
      success: "Login erfolgreich"
    }
  },
  register: {
    heading: "Registrieren",
    form: {
      email: {
        label: "E-Mail",
        validEmailError: "Die E-Mail muss gültig sein",
        tooShortError: "Die E-Mail muss mindestens 3 Zeichen enthalten",
        tooLongError: "Die E-Mail darf maximal 30 Zeichen enthalten"
      },
      password: {
        label: "Passwort",
        tooShortError: "Das Passwort muss mindestens 6 Zeichen enthalten",
        tooLongError: "Das Password darf maximal 30 Zeichen lang sein"
      }
    },
    cta: "Registrieren",
    toasts: {
      error: "Fehler bei der Registrierung, versuch es bitte noch einmal",
      success: "Registrierung erfolgreich"
    }
  },
  about: {
    title: "Infos",
    nav: "Infos"
  },
  contact: {
    title: "Kontakt",
    nav: "Kontakt"
  }
};
const de = {
  menu,
  page
};
export {
  de as default,
  menu,
  page
};
