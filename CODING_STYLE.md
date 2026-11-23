# Coding Style

Regeln für `web/` und `server/`, abgeleitet aus dem bestehenden Code. Wo der Code nicht einheitlich ist, gilt die Variante, die überwiegt oder im neueren Code steht. Die andere ist unter **Nicht** aufgeführt.

Ausgenommen ist vendored Code (shadcn, Aceternity, MagicUI). Er behält seinen eigenen Stil.

---

## 1. Formatierung

Prettier formatiert alles. Was Prettier entscheidet, wird nicht von Hand anders gemacht.

| Regel                   | server                     | web                        |
| ----------------------- | -------------------------- | -------------------------- |
| Einrückung              | 2 Leerzeichen              | 2 Leerzeichen              |
| Zeilenbreite            | 80                         | 80                         |
| Anführungszeichen       | einfach `'…'`              | doppelt `"…"`              |
| Semikolons              | immer                      | immer                      |
| Trailing Commas         | überall (`all`)            | überall (`all`)            |
| Klammern um Arrow-Param | immer `(x) => …`           | immer `(x) => …`           |
| Zeilenende              | LF, Leerzeile am Dateiende | LF, Leerzeile am Dateiende |

- Lange Strings und lange Tailwind-Klassenlisten bleiben in einer Zeile. Sie werden nicht von Hand umbrochen oder zerlegt.
- In JSX werden Leerzeichen an Zeilenumbrüchen explizit gesetzt: `{" "}`.

---

## 2. Dateien und Ordner

### Dateinamen

- **Immer kebab-case**, auch für Komponenten: `auth-card.tsx`, `use-scroll-lock.ts`, `app-config.service.ts`.
- `.tsx` nur, wenn die Datei JSX enthält, sonst `.ts`.
- Der Dateiname ist der Name des Hauptexports in kebab-case: `AuthCard` → `auth-card.tsx`, `useLoginForm` → `use-login-form.ts`.
- Hooks beginnen mit `use-`: `use-navigate-to-target.ts`.

**Die Rolle steht als Suffix im Namen**, im Server mit Punkt, im Web mit Bindestrich:

| server (`name.rolle.ts`) | web (`name-rolle.ts(x)`)                                    |
| ------------------------ | ----------------------------------------------------------- |
| `mail.module.ts`         | `login-schema.ts`, `auth-errors.ts`, `auth-routes.ts`       |
| `mail.service.ts`        | `auth-client.ts`, `axios-instance.ts`, `query-provider.tsx` |
| `auth.factory.ts`        | `service-dialog-context.tsx`                                |
| `env.validation.ts`      | `login-form.tsx`, `auth-card.tsx`, `login-error-dialog.tsx` |
| `swagger.config.ts`      | `legal-page-layout.tsx`, `cloud-devops-background.tsx`      |

Der Kontext kommt aus dem Ordner, deshalb wiederholt der Dateiname ihn nicht. Der Komponentenname enthält ihn trotzdem: `partner-program/faq.tsx` exportiert `PartnerProgramFaq`.

### Ordnernamen

- kebab-case: `about-us/`, `forgot-password/`, `app-config/`.
- **Sammelordner im Plural**: `components`, `hooks`, `schemas`, `utils`, `sections`, `primitives`, `effects`, `backgrounds`, `templates`.
- **Domänen- und Featureordner im Singular**: `auth`, `legal`, `navbar`, `footer`, `mail`, `prisma`.
- Hat ein Ordner eine Hauptdatei, heißt sie wie der Ordner: `hero/hero.tsx`, `navbar/navbar.tsx`, `mail/mail.module.ts`.
- Es gibt **keine `index.ts`-Barrel-Dateien**. Importiert wird immer die konkrete Datei.

---

## 3. Benennung im Code

### Grundregeln

- Bezeichner sind **englisch**, ausgeschrieben, ohne Präfixe wie `I` oder `T`.
- Erlaubte Abkürzungen: `id`, `ctx`, `config`, `prev`, `dpr`, `i`/`j` in `for`-Schleifen. Sonst ausschreiben: `event` statt `e`, `index` statt `i` in `.map`, `error` statt `err`.

### Variablen

| Was               | Regel                 | Beispiel                                                 |
| ----------------- | --------------------- | -------------------------------------------------------- |
| Normale Werte     | camelCase, Substantiv | `errorCode`, `loginUrl`, `scrollbarWidth`                |
| Listen            | Plural                | `services`, `nodes`, `points`                            |
| `.map`-Parameter  | Singular der Liste    | `services.map((service) => …)`, `stats.map((stat) => …)` |
| Index in `.map`   | `index`               | `items.map((item, index) => …)`                          |
| DOM-Refs          | Suffix `Ref`          | `canvasRef`, `containerRef`, `closeButtonRef`            |
| State             | `[x, setX]`           | `[submittedEmail, setSubmittedEmail]`                    |
| Updater-Parameter | `prev`                | `setIsOpen((prev) => !prev)`                             |
| DOM-Events        | `event`               | `(event: KeyboardEvent) => …`                            |
| Fehler            | `error`               | `const { error } = await …`, `catch (error)`             |

**Nicht:** `container` für einen Ref, `e` für ein Event.

### Booleans

- Präfix `is`, `has`, `can` oder `should`: `isPending`, `isOpen`, `isRedirecting`, `hasDropdown`, `isProduction`.
- Gilt auch für Props und State: `isOpen: boolean`, `[isVisible, setIsVisible]`.

**Nicht:** `visible`, `started`, `open` als Boolean-State.

### Konstanten

| Was                                                         | Regel       | Beispiel                                                                          |
| ----------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------- |
| Modulweite feste Werte: Konfig, Routen, Limits, Lookup-Maps | UPPER_SNAKE | `PASSWORD_MIN_LENGTH`, `AUTH_ROUTES`, `PROTECTED_PREFIXES`, `AUTH_ERROR_MESSAGES` |
| Inhaltslisten (Texte, Karten, Schritte)                     | camelCase   | `services`, `faqEntries`, `processSteps`                                          |
| Varianten- und Animationsobjekte                            | camelCase   | `buttonVariants`, `itemVariants`                                                  |

- **Einheit im Namen**, wenn der Typ sie nicht verrät: `CLOSE_DELAY_MS`, `PASSWORD_RESET_TOKEN_EXPIRES_MINUTES`.
- Ein Wert, der an mehr als einer Stelle gebraucht wird, wird zur Konstante. Einmalige Werte bleiben inline und bekommen bei Bedarf einen Kommentar.

### Funktionen

camelCase, **Verb zuerst**. Das Verb sagt, was die Funktion tut:

| Verb                                 | Bedeutung                                  | Beispiel                                                                    |
| ------------------------------------ | ------------------------------------------ | --------------------------------------------------------------------------- |
| `create…`                            | erzeugt etwas Neues                        | `createAuth`, `createNodes`                                                 |
| `build…`                             | setzt ein Objekt aus Teilen zusammen       | `buildSwaggerDocument`                                                      |
| `get…`                               | liefert einen abgeleiteten Wert            | `getAuthErrorMessage`, `getDashboardCallbackURL`                            |
| `to…`                                | wandelt um                                 | `toAbsoluteURL`                                                             |
| `resolve…`                           | ermittelt einen Wert aus der Umgebung      | `resolveCssColor`                                                           |
| `send…`                              | löst eine Aktion nach außen aus            | `sendVerificationEmail`                                                     |
| `is…` / `has…` / `can…` / `matches…` | Prädikat, gibt `boolean` zurück            | `isVerifyEmailErrorCode`, `hasValidSession`, `canSendMail`, `matchesPrefix` |
| `handle…`                            | Event-Handler innerhalb der Komponente     | `handleMouseLeave`, `handleBack`                                            |
| `on…`                                | Callback-Prop oder zurückgegebener Handler | `onSuccess`, `onClose`, `onSubmit`                                          |
| `open…` / `close…` / `clear…`        | Zustandswechsel                            | `closeService`, `closeMobileMenu`, `clearCloseTimeout`                      |
| `render…`                            | gibt JSX zurück, keine Komponente          | `renderPoint`                                                               |
| `use…`                               | Hook                                       | `useScrollLock`, `useLoginForm`                                             |

### Komponenten

- PascalCase, aufgebaut als **Domäne + Ding + Rolle**: `LoginErrorDialog`, `ForgotPasswordCard`, `AuthSubmitButton`, `LegalPageLayout`, `ExpandedServiceCard`.
- Die Rolle steht am Ende, aus einem festen Vokabular: `Card`, `Form`, `Field`, `Button`, `Dialog`, `Layout`, `Section`, `Background`, `Provider`, `Menu`, `Toggle`, `Header`, `Actions`, `Links`.
- Komponenten einer Domäne teilen ein Präfix: `AuthCard`, `AuthTextField`, `AuthEmailField`; `MobileNav`, `MobileNavMenu`, `MobileNavToggle`.
- Seiten heißen `…Page`, Layouts `…Layout`: `LoginPage`, `AuthLayout`.

### Typen

| Was                          | Regel                               | Beispiel                                      |
| ---------------------------- | ----------------------------------- | --------------------------------------------- |
| Props                        | `<Komponente>Props`                 | `AuthCardProps`                               |
| Optionen eines Hooks         | `Use<Hook>Options`                  | `UseRegisterFormOptions`                      |
| Abhängigkeiten einer Factory | `<Ding>Dependencies`                | `AuthDependencies`                            |
| Datensatz einer Inhaltsliste | `<Ding>Data`                        | `FaqEntryData`, `ServiceCardData`             |
| Formularwerte                | `<Formular>Values`                  | `LoginValues`                                 |
| Context-Wert                 | `<Name>ContextValue`                | `ServiceDialogContextValue`                   |
| Union aus festen Werten      | `<Ding>Code` / `…Variant` / `…Size` | `VerifyEmailErrorCode`, `RippleButtonVariant` |
| Generics                     | `T`                                 | `<T extends FieldValues>`                     |

### Server

- Klassen: `<Name>Module`, `<Name>Service`. Kollidiert ein Name mit einer Bibliothek, bekommt der eigene ein Präfix (`AppConfigService`) oder der Import einen Alias (`AuthModule as BetterAuthModule`).
- Methoden nennen die Absicht: `sendPasswordResetEmail`, nicht `send(type, …)`. Generische Helfer bleiben `private`.
- Getter sind Substantive bzw. Prädikate: `port`, `frontendUrl`, `mailFrom`, `isProduction`.
- Ein Config-Getter heißt wie die Env-Variable in camelCase: `FRONTEND_URL` → `frontendUrl`.
- Env-Variablen: UPPER*SNAKE, gruppiert über ein gemeinsames Präfix (`MAIL*_`, `POSTGRES\__`, `BETTER*AUTH*\*`), Einheit als Suffix (`\_MINUTES`).
- Enum-Member in PascalCase mit kleingeschriebenem String-Wert: `Production = 'production'`.

### Bezeichner in Strings

| Was                        | Regel                         | Beispiel                                    |
| -------------------------- | ----------------------------- | ------------------------------------------- |
| Routen                     | kebab-case                    | `/auth/forgot-password`, `/partner-program` |
| Section-IDs, Anker         | kebab-case, englisch          | `about-us`, `services`                      |
| Abgeleitete DOM-IDs        | `${id}-<rolle>`               | `${id}-error`, `${id}-description`          |
| Eigene CSS-Klassen         | kebab-case, Präfix nach Zweck | `anim-rise`, `anim-float`, `circuit-grid`   |
| CSS-Variablen              | kebab-case                    | `--delay`, `--glow`, `--section-surface`    |
| Template-Dateien (Mail)    | kebab-case, nach der Aktion   | `verify-email`, `reset-password`            |
| Zusammengesetzte Schlüssel | `<art>-<zweck>:<id>`          | `${kind}-cooldown:${userId}`                |
| Fehlercodes                | UPPER_SNAKE                   | `INVALID_TOKEN`, `EMAIL_NOT_VERIFIED`       |

---

## 4. Leerzeilen

Code ist in **Absätze** gegliedert. Eine Leerzeile trennt Schritte, die für sich verständlich sind. Innerhalb eines Schritts gibt es keine Leerzeilen. Mehr als eine Leerzeile hintereinander gibt es nie.

### Auf Dateiebene

Genau eine Leerzeile zwischen:

- `"use client";` und den Imports
- dem Import-Block und dem ersten Code
- allen Top-Level-Deklarationen (Konstanten, Typen, Funktionen, Komponenten)
- der Komponente und `export default X;`

Innerhalb des Import-Blocks stehen keine Leerzeilen.

```tsx
"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { RippleButton } from "@/components/ui/primitives/ripple-button";

const CLOSE_DELAY_MS = 50;

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu = ({ isOpen, onClose }: MenuProps) => {
  …
};

export default Menu;
```

### In Funktionen

1. **Deklarationen am Anfang bilden einen Block ohne Leerzeilen** (Hooks, State, Refs, Context).
2. **Jeder weitere logische Schritt** wird durch eine Leerzeile abgesetzt.
3. **Nach einer Guard Clause folgt immer eine Leerzeile.**
4. **Nach einem schließenden `}`** (`if`, `for`, `try`) folgt eine Leerzeile, außer es kommt direkt `}`, `else` oder `catch`.
5. **Vor dem abschließenden `return`** einer Funktion mit mehreren Anweisungen steht eine Leerzeile.
6. **Keine Leerzeile vor `return;`**, das einen `if`-Block direkt nach seiner Aktion beendet. Aktion und Abbruch gehören zusammen.
7. **Auf einen Aufruf, dessen Ergebnis danach geprüft wird**, folgt eine Leerzeile vor der Prüfung.

```ts
export const useLoginForm = () => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async ({ email, password, rememberMe }: LoginValues) => {
    try {
      const { error } = await authClient.signIn.email({ … });

      if (error) {
        toast.error(getAuthErrorMessage(error, "…"));
        return;
      }

      setIsRedirecting(true);
      router.replace("/dashboard");
    } catch {
      toast.error("…");
    }
  };

  return {
    form,
    onSubmit,
    isPending: form.formState.isSubmitting || isRedirecting,
  };
};
```

```ts
const hasValidSession = async (request: NextRequest) => {
  const cookie = request.headers.get("cookie");
  if (!cookie || !API_URL) return false;

  try {
    const response = await fetch(…);

    if (!response.ok) return false;

    const data = await response.json();
    return data !== null;
  } catch {
    return false;
  }
};
```

Hier sieht man beide Ausnahmen: Eine Guard Clause darf direkt an der Zeile kleben, die ihren Wert erzeugt (`const cookie` + `if`). Ein kurzes Paar aus Berechnung und `return` (`const data` + `return`) ist ein Absatz.

**Kurze Lookup-Funktionen** sind eine Kette ohne Leerzeilen, weil jede Zeile denselben Schritt macht:

```ts
export const getAuthErrorMessage = (
  error: AuthClientError,
  fallback: string,
) => {
  if (error.code && AUTH_ERROR_MESSAGES[error.code]) {
    return AUTH_ERROR_MESSAGES[error.code];
  }
  if (error.status === 429) {
    return "Zu viele Versuche. …";
  }
  return fallback;
};
```

### Kommentare

- Vor einem Kommentar steht eine Leerzeile, außer er ist die erste Zeile eines Blocks.
- Zwischen Kommentar und Code steht keine Leerzeile.

```ts
  if (!matchesPrefix(pathname, PROTECTED_PREFIXES)) return NextResponse.next();

  // Signing in requires a verified email, so for a logged-in user an old or
  // expired verification link is irrelevant: drop the error and stay here.
  if (isVerifyEmailErrorCode(errorCode)) {
```

### Klassen (Server)

- Eine Leerzeile zwischen allen Membern: Felder, Konstruktor, Methoden, Getter.
- Ein Gruppenkommentar steht mit Leerzeile davor direkt über dem ersten Member der Gruppe.
- Decorators stehen untereinander ohne Leerzeilen. Zwischen dekorierten Properties steht eine Leerzeile.

```ts
@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  // Server Configuration
  get port(): number {
    return this.configService.getOrThrow<number>("PORT");
  }

  get domain(): string {
    return this.configService.getOrThrow<string>("DOMAIN");
  }

  // Mail Configuration
  get mailHost(): string {
    return this.configService.getOrThrow<string>("MAIL_HOST");
  }
}
```

```ts
class EnvironmentVariables {
  // Server Configuration
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;
}
```

### Objekte, Interfaces, Arrays

- **Interfaces, Typ-Literale und Enums**: keine Leerzeilen zwischen den Membern.
- **Arrays aus Objekten**: keine Leerzeilen zwischen den Einträgen. Jeder Eintrag ist mehrzeilig, außer er passt mit zwei, drei kurzen Feldern in eine Zeile (`{ href: "/agb", label: "AGB" }`).
- **Große Konfigurationsobjekte**: einfache Schlüssel oben ohne Leerzeilen. Verschachtelte Blöcke darunter sind durch je eine Leerzeile getrennt.

```ts
return betterAuth({
  appName: 'Code-Control',
  baseURL: config.betterAuthUrl,
  secret: config.betterAuthSecret,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  user: {
    additionalFields: { … },
  },

  emailAndPassword: {
    …
  },
});
```

### JSX

- Eine Leerzeile zwischen **großen Geschwisterblöcken**: Hintergrund und Inhalt, Kopf und Hauptteil, Feldgruppe und Aktionen, Submit-Button und Wechsel-Link.
- Keine Leerzeile zwischen **kleinen Geschwistern**: Label und Input, Icon und Text, Überschrift und Untertitel in einem Kopfbereich.
- Ein Abschnittskommentar `{/* … */}` beginnt einen großen Block und hat deshalb eine Leerzeile davor.

```tsx
return (
  <form
    onSubmit={form.handleSubmit(onSubmit)}
    noValidate
    className="flex flex-col gap-5"
  >
    <FieldGroup>
      <AuthEmailField control={control} name="email" />
      <AuthPasswordField control={control} name="password" />
    </FieldGroup>

    <AuthSubmitButton isPending={isPending} pendingLabel="Anmeldung läuft …">
      Anmelden
    </AuthSubmitButton>

    <AuthSwitchLink prompt="Noch kein Konto?" href={AUTH_ROUTES.register}>
      Jetzt registrieren
    </AuthSwitchLink>
  </form>
);
```

---

## 5. Reihenfolge

### In einer Datei

1. `"use client";` (nur wenn nötig)
2. Imports
3. Modulkonstanten (UPPER_SNAKE)
4. Paare aus **Typ und Verwender**: Das Interface steht direkt über der Liste, Funktion oder Komponente, die es benutzt
5. Hilfsfunktionen und private Teilkomponenten
6. Hauptkomponente bzw. Hauptfunktion
7. `export default X;` (Web, nur bei Komponenten)

```tsx
interface FaqEntryData {
  id: string;
  question: string;
  answer: string;
}

const faqEntries: FaqEntryData[] = [
  …
];

const PartnerProgramFaq = () => {
  …
};

export default PartnerProgramFaq;
```

### Imports

1. React, dann das Framework (`next/*` bzw. `@nestjs/*`)
2. weitere Pakete und `node:`-Builtins
3. eigene Module über `@/`, grob nach Schicht (`api`, `components`, `context`, `hooks`, `lib`, `schemas`, `utils`)
4. relative Imports (`./`). Im Web nur, wenn `@/` nicht passt, im Server immer mit `.js`-Endung

- Reine Typ-Imports als `import type { … }`. Werden Typen und Werte aus demselben Modul geholt, bekommen die Typen den Inline-Modifier: `import { useId, useState, type ComponentProps } from "react";`
- Builtins immer mit `node:`-Präfix: `node:fs`, `node:crypto`.

**Nicht:** `@/`-Imports vor Paket-Imports, `../../` quer durch den Baum, Typen als Wert importieren.

### In einer Komponente oder einem Hook

1. Hooks: Router und Pfad, State, Refs, Context, eigene Hooks (ein Block)
2. abgeleitete Werte
3. Hilfsfunktionen, die ein Effekt braucht
4. Effekte
5. Handler (`handle…`)
6. Early Returns
7. `return` mit JSX bzw. Rückgabeobjekt

### In einer Klasse (Server)

1. Felder (`private readonly logger = new Logger(X.name);`)
2. Konstruktor mit `private readonly`-Parametern
3. öffentliche Methoden
4. private Getter
5. private Methoden

### Props in JSX

1. `key`
2. was das Element identifiziert: `id`, `ref`, `type`, `name`, `href`, `src`, `icon`
3. Verhalten und Zustand: Werte, Handler, `disabled`, Animationsprops, `aria-expanded` usw.
4. `className`, danach `style`
5. `aria-hidden="true"` an dekorativen Elementen ganz am Ende

**Spread-Position entscheidet über Überschreibbarkeit:** Was vor `{...props}` steht, ist ein Default, den der Aufrufer überschreiben kann. Was danach steht, ist fest.

```tsx
<AuthTextField
  placeholder="name@firma.at"
  autoComplete="email"
  {...props}
  label={label}
  type="email"
/>
```

---

## 6. Funktionen

### Form

| Wo                                        | Form                                                      |
| ----------------------------------------- | --------------------------------------------------------- |
| Web: Komponenten, Hooks, Utilities, alles | Arrow Function: `export const x = (…) => …`               |
| Server: exportierte Top-Level-Funktionen  | Deklaration: `export function createAuth(…) { … }`        |
| Server: lokale Helfer, Callbacks          | Arrow Function: `const canSendMail = async (…) => { … }`  |
| Server: Einstiegsskript                   | `async function bootstrap() { … }` + `await bootstrap();` |

- Besteht der Rumpf aus einem einzigen Ausdruck, gibt es keinen Block: `=> (` für JSX, `=> value` sonst.
- Hat der Rumpf mehr als einen Ausdruck, steht ein Block mit `return`.

**Nicht:** `export default function X()`, `React.FC<Props>`, `function` im Web, `() => { return (<div />); }` bei reinem Markup.

### Parameter

- **Bis zu drei Primitive** werden positional übergeben: `sendPasswordResetEmail(to, name, resetLink)`.
- **Optionen und Abhängigkeiten** kommen als ein Objekt mit eigenem Interface und werden in der Signatur destrukturiert: `({ onSuccess }: UseRegisterFormOptions)`, `({ prisma, config, mailService }: AuthDependencies)`.
- **Props und Submit-Werte** werden immer in der Signatur destrukturiert, Defaults stehen dort: `({ align = "center", children }: SectionEyebrowProps)`, `async ({ email, password }: LoginValues) =>`.

### Rückgabe

- Rückgabetypen werden inferiert. Explizit stehen sie nur, wo sie zum Vertrag gehören: Getter, Type Guards (`code is VerifyEmailErrorCode`), Tupel (`[number, number, number]`), Generics.
- Hooks geben ein Objekt mit Shorthand-Properties zurück: `return { form, onSubmit, isPending: form.formState.isSubmitting };` Liefert ein Hook nur eine Funktion, gibt er die Funktion selbst zurück.
- Typen werden aus der Implementierung abgeleitet statt doppelt geschrieben: `ReturnType<typeof createAuth>`, `z.infer<typeof loginSchema>`, `keyof typeof MESSAGES`.

---

## 7. Kontrollfluss und Ausdrücke

### `if`

- **Ohne Klammern nur einzeilig**, wenn Bedingung und Anweisung zusammen in eine Zeile passen: `if (!allowed) return;`, `if (event.key === "Escape") onClose();`
- Sobald etwas umbricht oder mehr als eine Anweisung im Block steht: Klammern.
- **Guard Clauses statt Verschachtelung.** Der Normalfall steht am Ende, nicht im `if`.
- **Kein `else` nach `return`.** `if/else` nur bei zwei gleichwertigen Zweigen.

```ts
// Ja
if (!response.ok) return false;

const data = await response.json();

// Nicht
if (response.ok) {
  const data = await response.json();
  …
} else {
  return false;
}
```

### Ausdrücke

| Fall                               | Schreibweise                                             |
| ---------------------------------- | -------------------------------------------------------- |
| Vergleich                          | immer `===` / `!==`                                      |
| „Noch kein Wert“ (State, Ergebnis) | `null`: `useState<string \| null>(null)`, `?? null`      |
| Optionale Props und Parameter      | `undefined` über `?`: `className?: string`               |
| Defaults                           | `??`, nicht `\|\|`                                       |
| Optionaler Zugriff und Aufruf      | `?.`: `onClick?.(event)`                                 |
| Lazy Initialisierung               | `??=`: `refreshPromise ??= …`                            |
| Boolean erzwingen                  | `!!value`                                                |
| Schlüssel prüfen                   | `Object.hasOwn(map, key)`                                |
| Strings zusammensetzen             | Template Literal, nie `+`                                |
| Zeitdauern                         | als Produkt mit Kommentar: `60 * 60 * 24 * 7, // 7 days` |
| Dezimalzahlen                      | mit führender Null: `0.15`, nicht `.15`                  |
| Feste Objekte                      | `as const`                                               |

### Fallunterscheidung über Daten

Statt `switch` oder `if`-Ketten gibt es eine Map und einen Fallback:

```ts
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  EMAIL_NOT_VERIFIED: "…",
  INVALID_TOKEN: "…",
};
```

Werte von außen (Query-Parameter, Fehlercodes) werden mit einem Type Guard verengt, bevor sie als Schlüssel dienen.

### Destructuring

Werden zwei oder mehr Eigenschaften eines Objekts gebraucht, wird destrukturiert, und zwar am Anfang des Blocks:

```ts
const { pathname, searchParams } = request.nextUrl;
const { body, documentElement } = document;
const { control } = form;
const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
```

### Asynchronität

- Nur `async`/`await`, keine `.then`-Ketten (Ausnahme: ein `.finally`, das einen Cache zurücksetzt).
- Jede Promise wird `await`et oder bewusst mit `void` verworfen: `void mailService.sendVerificationEmail(…);`
- Ein Prüfergebnis bekommt erst einen Namen, dann folgt der Guard:

```ts
const allowed = await canSendMail("verification-email", user.id);
if (!allowed) return;
```

### Fehler

- `catch {` ohne Variable, wenn der Fehler nicht gebraucht wird.
- Ein `try` umschließt die ganze Operation, nicht einzelne Zeilen.
- Fachliche Fehler (Rückgabewert `error`) und technische Fehler (Exception) werden getrennt behandelt: spezifische Meldung gegen allgemeine Meldung.
- Beim Start wird geworfen, zur Laufzeit wird bei Nebenwirkungen geloggt und weitergemacht.

---

## 8. Typen

- **`interface`** für Objektformen: Props, Optionen, Abhängigkeiten, Datensätze, Context-Werte.
- **`type`** für alles andere: Unions (`"small" | "medium"`), Ableitungen (`z.infer<…>`, `keyof typeof …`, `ReturnType<…>`), Intersections (`Promise<T> & { cancel: () => void }`).
- Interfaces erweitern mit `extends`, Felder entfernen mit `Omit<…>`: `extends Omit<ComponentProps<"input">, "id" | "name">`.
- Kein `any`, kein `@ts-ignore`, kein `eslint-disable`.
- Optionale Felder mit `?`, nie `| undefined` im Interface.
- `export` steht direkt an der Deklaration (`export interface …`, `export const …`). Nur `export default` steht gesammelt am Dateiende.

**Nicht:** `type Props = { … }` für Objektformen.

---

## 9. Exporte

| Was                                 | Web                      | Server |
| ----------------------------------- | ------------------------ | ------ |
| Hauptkomponente einer Datei         | `export default` am Ende | –      |
| weitere Komponenten derselben Datei | named                    | –      |
| Hooks, Utilities, Konstanten, Typen | named                    | named  |
| Klassen, Funktionen                 | –                        | named  |

Pro Datei gibt es höchstens einen Default-Export. Next.js-Dateien (`page`, `layout`) brauchen ihn.

---

## 10. JSX und Tailwind

### JSX

- String-Props ohne Klammern: `icon="lucide:mail"`, nicht `icon={"lucide:mail"}`.
- Boolean-Props als Kurzform: `noValidate`, `priority`, nicht `visible={true}`.
- Leere Elemente selbstschließend: `<div className="…" />`, nicht `<div></div>`.
- Bedingtes Rendern mit `&&`, Entweder-oder mit Ternary. Ganze Ansichten wechseln per Early Return.
- Inline-Handler sind der Normalfall: `onClick={() => setIsOpen(false)}`. Ein benannter `handle…` entsteht erst bei Verzweigung, Timern oder Wiederverwendung.
- `key` kommt aus einer stabilen ID des Datensatzes, nie aus dem Index.
- Fragmente als `<>…</>`, `<Fragment key={…}>` nur mit Key.
- Buttons außerhalb von Formularen bekommen `type="button"`.
- Dekoration bekommt `aria-hidden="true"`, Buttons nur mit Icon ein `aria-label`.

### Tailwind

- Nur Utilities im `className`, keine Inline-Styles für Layout. `style` nur für dynamische Werte und CSS-Variablen: `style={{ "--delay": "0.35s" } as CSSProperties}`.
- **Statische Klassen als einfacher String.** `cn()` nur, wenn kombiniert oder bedingt wird: `cn(base, isActive && "…", className)`.
- Eine wiederverwendbare Komponente nimmt `className` an und gibt es als letztes Argument an `cn()`.
- Farben nur über Design-Tokens: `bg-card/60`, `text-muted-foreground`, `border-border`. Transparenz über `/xx`.
- Gleichseitige Größen mit `size-*`, nicht `h-* w-*`.
- Klassenreihenfolge: eigene Klassen zuerst, dann Layout, Box-Modell, Typografie, Farbe, States, Breakpoints (Reihenfolge wie `prettier-plugin-tailwindcss`).
- Varianten mit `cva`, zugehörige Wertetabellen als `Record<Variant, string>`.

**Nicht:** `cn("nur-statisch")`, Template Literals für bedingte Klassen, doppelte Leerzeichen im Klassenstring.

---

## 11. Kommentare

- **Englisch.** Ganze Sätze mit Punkt, wenn sie etwas erklären. Kurze Labels ohne Punkt (`// 7 days`, `// Server Configuration`).
- Kommentare erklären **warum**, nie **was**. Typische Anlässe: eine nicht offensichtliche Abhängigkeit, eine Sicherheitsentscheidung, eine Einheit, eine Umrechnung.
- Einheit oder Zweck als Kommentar am Zeilenende: `bodyParser: false, // Required for Better Auth`.
- Gruppenkommentare in langen Listen werden über zusammengehörige Dateien gespiegelt (`// Server Configuration`, `// Mail Configuration`).
- JSX-Abschnitte: `{/* Heading */}`, `{/* CTAs */}`. Kurz, Großbuchstabe am Anfang.
- JSDoc `/** … */` nur für Hooks und Funktionen mit nicht offensichtlichem Verhalten.
- `// TODO: …` mit Doppelpunkt.
- Kein auskommentierter Code. Was nicht gebraucht wird, wird gelöscht.

---

## 12. Sprache

- **Code englisch**: Bezeichner, Kommentare, Logs, Fehlermeldungen für Entwickler (`Failed to send "${template}" mail to ${to}`).
- **Oberfläche deutsch** (`de-AT`): UI-Texte, Toasts, Validierung, `aria-label`, Metadata, Mails. Texte stehen direkt im Code, es gibt keine i18n-Schicht.
- **Anrede: Sie.**
- Fehlermeldungen: „Was ist passiert. Bitte was tun.“ (_„Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es später erneut.“_)
- Validierung: „Bitte geben Sie … ein.“, immer mit Punkt, bei Formaten mit Beispiel („z. B. +43 660 1234567“).
- Ladezustand als Satz mit Ellipse und Leerzeichen davor: „Anmeldung läuft …“
- Typografie: `–` mit Leerzeichen als Gedankenstrich, `…` als ein Zeichen, `z. B.` mit Leerzeichen, `2.000 €`.
