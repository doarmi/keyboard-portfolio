# Keyboard Portfolio

> 키보드 자체를 포트폴리오의 내비게이션으로 활용한 인터랙티브 포트폴리오
> 랜딩 페이지입니다.

## 프로젝트 소개

Keyboard Portfolio는 일반적인 카드형 프로젝트 목록 대신 **실제 키보드
입력과 화면 속 키보드 인터페이스**를 이용해 프로젝트를 탐색하도록 설계한
포트폴리오입니다.

사용자는 키보드의 `P`, `O`, `D` 키를 직접 누르거나 화면의 키를 클릭해
각각의 프로젝트로 이동할 수 있습니다. 타건 피드백과 사운드, 프로젝트
소개 섹션, About / Skills / Contact를 하나의 랜딩 페이지로 구성했습니다.

> 이 README는 제출된 `keyboard-portfolio(1).zip`의 실제 소스코드를
> 기준으로 작성했습니다.

------------------------------------------------------------------------

## Live Demo

🔗 **Keyboard Portfolio**  
https://keyboard-portfolio-seven.vercel.app/

> 키보드 인터랙션을 통해 PLIVY, OASIS, DJSTAR 프로젝트를 탐색할 수 있는 포트폴리오 랜딩 페이지입니다.


## Keyboard Navigation

메인 키보드는 세 프로젝트의 바로가기 역할을 합니다.

  Key   Project
  ----- ---------
  `P`   PLIVY
  `O`   OASIS
  `D`   DJSTAR

실제 키보드 입력뿐 아니라 화면에 표시된 키를 클릭하는 방식도 지원합니다.

프로젝트 선택 시 연결된 배포 페이지를 새 탭으로 엽니다.

------------------------------------------------------------------------

## 주요 기능

### 1. Physical Keyboard Input

브라우저의 `keydown` / `keyup` 이벤트를 이용해 실제 키보드 입력을
감지합니다.

`P`, `O`, `D` 키를 누르면 해당 프로젝트와 연결되며, 키가 눌린 상태를
화면에도 시각적으로 반영합니다.

### 2. On-screen Keyboard

물리 키보드를 사용하지 않아도 화면의 키를 클릭해 동일한 프로젝트 탐색이
가능합니다.

이를 통해 키보드라는 비주얼 콘셉트가 단순 장식이 아니라 실제 내비게이션
인터페이스로 동작하도록 구현했습니다.

### 3. Typing Sound

**Web Audio API**를 이용해 키 입력에 대한 타건음을 생성합니다.

별도의 오디오 파일을 단순 재생하는 방식이 아니라 브라우저 오디오 기능을
이용한 키 입력 피드백을 제공합니다.

### 4. SOUND ON / OFF

사용자가 타건음을 끄거나 다시 켤 수 있도록 사운드 토글을 제공합니다.

사운드 설정은 `localStorage`에 저장되어 페이지를 다시 열었을 때도
사용자의 선택을 유지합니다.

### 5. Project Sections

랜딩 페이지 내부에서 주요 프로젝트를 소개합니다.

-   PLIVY
-   OASIS
-   DJSTAR

각 프로젝트를 포트폴리오의 전체 흐름 안에서 확인한 뒤 실제 배포 페이지로
이동할 수 있도록 연결했습니다.

### 6. Scroll Animation

프로젝트 섹션과 페이지 전환 연출에 **GSAP / ScrollTrigger**를
사용합니다.

스크롤에 따라 콘텐츠가 등장하고 전환되도록 구성해 키보드 Hero 이후에도
인터랙티브한 흐름을 유지합니다.

### 7. About / Skills / Contact

프로젝트 소개 외에도 포트폴리오에 필요한 개인 소개 영역을 구성했습니다.

-   About
-   Skills
-   Contact
-   Instagram 연결
-   Email 복사

### 8. Email Copy

이메일을 클릭하면 **Clipboard API**를 이용해 주소를 복사합니다.

복사가 완료되면 화면의 상태가 `COPIED`로 변경되어 사용자가 결과를 바로
확인할 수 있습니다.

### 9. SEO / Open Graph

`index.html`에는 공유 및 검색 노출을 위한 메타 정보가 실제 구성되어
있습니다.

-   Page Title
-   Meta Description
-   Canonical
-   Open Graph Title
-   Open Graph Description
-   Open Graph Image
-   Twitter Card

------------------------------------------------------------------------

## Tech Stack

  구분                        기술
  --------------------------- ---------------------------
  Frontend                    React 19
  Language                    TypeScript
  Build                       Vite
  Animation                   GSAP
  Scroll Animation            ScrollTrigger
  Audio                       Web Audio API
  Storage                     localStorage
  Clipboard                   Clipboard API
  3D Dependency / Component   Three.js / GLTFLoader
  SEO / Sharing               Open Graph / Twitter Card

------------------------------------------------------------------------

## Three.js 구현 범위

프로젝트에는 `Three.js`와 `GLTFLoader`를 이용해 `IBM_5155.glb` 모델을
렌더링하는 `DJStarModel.tsx` 컴포넌트가 존재합니다.

다만 현재 메인 `App.tsx`의 실제 렌더링 흐름에서는 이 컴포넌트가 직접
사용되지 않습니다.

따라서 현재 배포 화면의 핵심 기술을 설명할 때는 **React + TypeScript +
GSAP + Web Audio API 기반 인터랙션**을 중심으로 설명하는 것이
정확합니다.

------------------------------------------------------------------------

## 코드 구조상 참고사항

프로젝트에는 범용 키 입력 처리를 위한 `useKeyboardInput.ts` 훅도
존재합니다.

현재 메인 Keyboard Hero의 `P / O / D` 입력은 해당 훅이 아니라 컴포넌트
내부의 `keydown` / `keyup` 이벤트 처리 로직을 통해 동작합니다.

README에서는 실제 메인 화면에서 사용되는 방식을 기준으로 기능을
설명했습니다.

------------------------------------------------------------------------

## User Flow

``` text
Keyboard Hero
      ↓
P / O / D 입력 또는 화면 키 클릭
      ↓
Project 선택
      ↓
PLIVY / OASIS / DJSTAR 배포 페이지

또는

Keyboard Hero
      ↓
Scroll
      ↓
Project Sections
      ↓
About / Skills
      ↓
Contact
```

------------------------------------------------------------------------

## 프로젝트 구조

``` text
KEYBOARD-PORTFOLIO/
├── public/
│   ├── assets/
│   │   ├── models/
│   │   │   └── IBM_5155.glb
│   │   ├── scrub/
│   │   │   ├── keyboard_01_wide.webp
│   │   │   ├── keyboard_02_mid.webp
│   │   │   ├── keyboard_03_close.webp
│   │   │   └── keyboard_04_final.webp
│   │   ├── djstar-console.jpg
│   │   ├── oasis-band.jpg
│   │   └── plivy-honest-cover.jpg
│   └── og-image.png
├── src/
│   ├── components/
│   │   ├── DJStarModel.tsx
│   │   └── SectionPlaceholder.tsx
│   ├── data/
│   │   └── projects.ts
│   ├── hooks/
│   │   ├── useKeyboardInput.ts
│   │   └── useKeyboardSound.ts
│   ├── sections/
│   │   ├── About.tsx
│   │   ├── Boot.tsx
│   │   ├── Contact.tsx
│   │   ├── KeyboardHero.tsx
│   │   ├── KeyboardOS.tsx
│   │   ├── Projects.tsx
│   │   └── Skills.tsx
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

> `examples` 등 메인 포트폴리오 실행과 직접 관련 없는 예제 폴더는
> 트리에서 제외했습니다.

------------------------------------------------------------------------

## 구현 범위

### 실제 코드에서 확인되는 구현

-   React + TypeScript 기반 랜딩 페이지
-   실제 키보드 `P / O / D` 입력 감지
-   화면 키 클릭
-   키 Pressed 상태 UI
-   프로젝트별 외부 페이지 연결
-   Web Audio API 기반 타건음
-   SOUND ON / OFF
-   사운드 설정 LocalStorage 저장
-   GSAP
-   ScrollTrigger
-   프로젝트 소개 섹션
-   About / Skills / Contact
-   Clipboard API 기반 이메일 복사
-   `COPIED` 상태 표시
-   Instagram 링크
-   SEO Meta Tags
-   Open Graph
-   Twitter Card

### 코드에는 존재하지만 현재 메인 렌더링에서 확인되지 않는 요소

-   `DJStarModel.tsx`의 Three.js / GLTFLoader 3D 모델
-   범용 `useKeyboardInput.ts` Hook

따라서 위 두 항목은 현재 메인 페이지의 실제 사용 기능으로 과장해
표기하지 않았습니다.

------------------------------------------------------------------------

## 실행 방법

``` bash
npm install
npm run dev
```

Production Build:

``` bash
npm run build
```

Build Preview:

``` bash
npm run preview
```

------------------------------------------------------------------------

## 제작 의도

포트폴리오의 첫 화면 자체가 하나의 작업물처럼 느껴지도록 만드는 것을
목표로 했습니다.

일반적인 메뉴나 프로젝트 카드 대신 **키보드라는 익숙한 물리적
인터페이스를 웹 내비게이션으로 재해석**하고, 실제 키 입력과 클릭,
타건음, 스크롤 애니메이션을 결합했습니다.

이를 통해 사용자가 프로젝트 목록을 단순히 읽는 것이 아니라 직접 키를
누르고 탐색하면서 PLIVY, OASIS, DJSTAR로 이어지는 포트폴리오 경험을
만들었습니다.
