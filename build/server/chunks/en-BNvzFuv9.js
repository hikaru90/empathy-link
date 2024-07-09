const menu = {
  profile: {
    account: "My Account",
    logout: "Logout"
  },
  bar: {
    home: "Dashboard",
    selfempathy: "Selfempathy",
    fights: "Fights",
    feedback: "Feedback",
    learn: "Learn"
  },
  soon: "soon",
  share: {
    cta: "Share",
    copyLink: "Copy link",
    copyLinkConfirmation: "Link copied to clipboard",
    mailLink: "Send link",
    mailLinkConfirmation: "Link was sent successfully",
    mailLinkError: "Error sending link",
    mailDialogText: "With whom do you want to fight?"
  }
};
const page = {
  respond: {
    explanationTitle: "Explanation",
    explanation: "An Empathy-Link is a communication framework that emphasizes empathy, honest expression, and mutual understanding. It focuses on identifying and expressing feelings and needs without judgment or blame, aiming to foster compassionate connections and resolve conflicts peacefully.",
    steps: {
      greeting: {
        heading: "sent you an Empathy-Link",
        explanationCta: "What is an Empathy-Link?",
        question: "Do you feel ready to open it?"
      },
      disclaimer: {
        heading: "Please remeber",
        description: "The things you are about to read don't have anything to do with you."
      },
      breathe: {
        heading: "Breathe"
      },
      ownerObservation: {
        heading: "described the situation as follows"
      },
      ownerFeelings: {
        heading: "had the following feelings"
      },
      ownerNeeds: {
        heading: "needs were"
      },
      ownerRequest: {
        heading: "requested the following"
      }
    }
  },
  home: {
    title: "Homepage",
    nav: "Home",
    hero: "In today's rush, amid endless distractions and mounting todo lists, being mindful of how and why you connect with your peers has never been more difficult.",
    cta: "Start Connecting",
    components: {
      the4steps: {
        heading: "The 4 Steps to connect with yourself and others",
        steps: {
          observation: {
            heading: "Observe",
            text: "Describe what happened without judgment."
          },
          feelings: {
            heading: "Feel",
            text: "Express how you felt during your observation."
          },
          needs: {
            heading: "Identify needs",
            text: "Identify the underlying needs driving your feelings."
          },
          request: {
            heading: "Make a request",
            text: "Make a clear, specific request to address your needs."
          }
        },
        cta: {
          link: "#",
          target: "_self",
          text: "Learn more about the 4 steps"
        }
      },
      modules: {
        heading: "4 App Modules for enhanced Mindfulness",
        modules: {
          selfempathy: "Selfempathy",
          fight: "Fight",
          feedback: "Feedback",
          learn: "Learn"
        }
      },
      selfempathy: {
        heading: "Selfempathy",
        description: "Everyone is their own person. That's why it's important to become aware of what you think, feel, need and want. Using the 4 steps, you can give yourself self-empathy at regular intervals and track changes over time."
      },
      fight: {
        heading: "Fighting done right",
        description: "",
        steps: {
          observation: "Observation",
          feelings: "Feelings",
          needs: "Needs",
          request: "Request"
        }
      },
      feedback: {
        heading: "Feedback",
        description: "Feedback rarely aims to truly strengthen interpersonal bonds. Especially in a professional context, it is often difficult to give sincere feedback. However, by following the 4 steps, this feat can also be achieved.",
        steps: {
          observation: "Give feedback based on reality",
          feelings: "Honest messages for a genuine connection",
          needs: "Stronger relationships by sharing needs",
          request: "Better performance through solution-oriented requests"
        }
      },
      learn: {
        heading: "Learn",
        description: "Empathy-Link is based on Nonviolent Communication by Marshall Rosenberg. One can honestly spend a lifetime studying it. Therefore, it is all the more worthwhile to keep learning. In the learning section of the app, concepts that are otherwise only superficially touched upon are explained in depth."
      }
    }
  },
  dashboard: {
    fights: {
      tableCaption: "Fights",
      table: {
        id: "Id",
        partner: "Partner",
        date: "Date",
        opened: "Opened",
        round: "Round"
      }
    },
    feelings: {
      heading: "Feelings",
      positive: "positive",
      negative: "negative",
      empty: "No feelings"
    },
    needs: {
      heading: "Needs",
      selfcentered: "self",
      community: "community",
      empty: "No needs"
    }
  },
  fight: {
    heading: "Fight",
    card: {
      observation: "Observation",
      feelings: "Feelings",
      needs: "Needs",
      request: "Request"
    }
  },
  fights: {
    create: "Start a fight",
    loadMore: "Load more",
    form: {
      general: {
        prev: "back",
        next: "Next",
        steps: {
          info: "Informations",
          observation: "Observation",
          feelings: "Feelings",
          needs: "Needs",
          request: "Request"
        },
        badFeelings: "Bad Feelings",
        goodFeelings: "Good Feelings",
        positiveNeeds: "When needs are met",
        negativeNeeds: "When needs are not met"
      },
      name: {
        label: "What is the Name of the Person you are fighting with?",
        tooShortError: "Name must be at least 3 characters long"
      },
      observation: {
        label: "What did you observe?",
        tooShortError: "Please explain your observation in at least 10 characters"
      },
      feelings: {
        label: "How did you feel?",
        tooFewError: "Select at least one Feeling"
      },
      needs: {
        label: "What are your Needs?",
        tooFewError: "Select at least one Need"
      },
      request: {
        label: "What is your Request?",
        tooFewError: "Please formulate a request that has at least 10 characters"
      }
    }
  },
  login: {
    heading: "Login",
    form: {
      email: {
        label: "Mail",
        validEmailError: "This is not a valid E-Mail",
        tooShortError: "Mail must be at least 3 characters long",
        tooLongError: "Mail must be at most 30 characters long"
      },
      password: {
        label: "Password",
        tooShortError: "Password must be at least 6 characters long",
        tooLongError: "Password must be at most 30 characters long"
      }
    },
    cta: "Login",
    toasts: {
      error: "Error logging in, please try again",
      success: "Login successful"
    }
  },
  register: {
    heading: "Register",
    form: {
      email: {
        label: "Mail",
        validEmailError: "This is not a valid E-Mail",
        tooShortError: "Mail must be at least 3 characters long",
        tooLongError: "Mail must be at most 30 characters long"
      },
      password: {
        label: "Password",
        tooShortError: "Password must be at least 6 characters long",
        tooLongError: "Password must be at most 30 characters long"
      }
    },
    cta: "Register",
    toasts: {
      error: "Error registering, please try again",
      success: "Registering successful"
    }
  },
  about: {
    title: "About",
    nav: "About"
  },
  contact: {
    title: "Contact",
    nav: "Contact Us"
  }
};
const en = {
  menu,
  page
};

export { en as default, menu, page };
//# sourceMappingURL=en-BNvzFuv9.js.map
