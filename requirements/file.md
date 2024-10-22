## 파일 구조

프로젝트의 주요 파일 구조는 다음과 같습니다:

hanbraille/
│
├── data/                # 데이터 디렉토리
│   ├── output           # 점자 번역된 파일
│   ├── train            # 점자 번역할 파일
│   ├── val              # 점자 번역할 파일
│   └── README.md        # 데이터 디렉토리 설명
│
├── out/                 # 빌드 출력 디렉토리
│   ├── braille.js       # 컴파일된 Braille 클래스
│   ├── hanbraille.js    # 컴파일된 HanBraille 클래스
│   ├── exec.js          # 컴파일된 명령줄 인터페이스
│   └── web.js           # 컴파일된 웹 인터페이스
│
├── node_modules/        # 프로젝트 의존성 (gitignore에 의해 무시됨)
│
├── braille.ts           
├── hanbraille.ts
├── exec.ts
├── web.ts
│
├── package.json         # 프로젝트 메타데이터 및 의존성 정의
├── package-lock.json    # 의존성 버전 잠금 파일
├── tsconfig.json        # TypeScript 컴파일러 설정
├── .gitignore           # Git 무시 파일 목록
└── README.md            # 프로젝트 문서

주요 파일들의 역할:
- `braille.js`: 기본 점자 변환 로직을 포함하는 Braille 클래스가 정의된 파일입니다.
- `hanbraille.js`: 한글 점자 변환을 위한 HanBraille 클래스가 정의된 파일입니다.
- `exec.js`: 명령줄 인터페이스를 구현하여 사용자가 쉽게 한글을 점자로 변환할 수 있게 하는 파일입니다.
- `web.js`: 웹 인터페이스를 구현하여 사용자가 쉽게 한글을 점자로 변환할 수 있게 하는 파일입니다.
- `package.json`: 프로젝트의 메타데이터와 의존성을 정의합니다.
- `tsconfig.json`: TypeScript 컴파일러 설정을 지정합니다.
- `.gitignore`: Git에서 추적하지 않을 파일과 디렉토리를 지정합니다.

이 구조는 TypeScript로 작성된 소스 코드가 `out/` 디렉토리에 컴파일되어 있음을 보여줍니다. `node_modules/`는 프로젝트의 의존성을 포함하고 있으며, .gitignore에 의해 Git에서 무시됩니다.

추가 개발:
- `data/` 디렉토리에 데이터를 넣으면 파이썬으로 데이터를 분석하고 exec.ts를 컴파일하여 명령줄 인터페이스를 사용하여 원하는 텍스트를 점자로 번역할 수 있습니다.