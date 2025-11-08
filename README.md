# ShareBite

자취생을 위한 C2C 식자재 공동구매 플랫폼

## 개요

ShareBite은 대용량 식품을 소분 단위로 나누어 사는 번거로움을 제거하는 자동화된 공동구매 플랫폼입니다.

## 주요 기능

- ✅ 공구 생성 및 참여
- ✅ 자동 모집 관리 (최소인원 검증)
- ✅ 계좌이체 기반 분할 정산 안내
- ✅ 픽업 시간·장소 관리
- ✅ 노쇼 기록 및 신뢰도 시스템
- ✅ 사용자 프로필 및 참여 내역

## 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (Prisma ORM)

## 시작하기

### 설치

```bash
npm install
```

### 데이터베이스 설정

```bash
npm run db:push
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
/workspace
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── groups/            # 공구 관련 페이지
│   ├── profile/           # 프로필 페이지
│   └── page.tsx           # 홈 페이지
├── components/            # React 컴포넌트
├── lib/                   # 유틸리티 함수
├── prisma/                # Prisma 스키마
└── public/                # 정적 파일
```

## 주요 화면

- **홈**: 모집 중인 공구 목록
- **공구 상세**: 공구 정보 및 참여
- **공구 생성**: 새로운 공구 제안
- **픽업 관리**: 출석 체크 및 노쇼 처리
- **프로필**: 참여 내역 및 신뢰도

## MVP 범위

### 포함된 기능
- 공구 생성 및 참여
- 자동 모집 상태 관리
- 기본 정산 안내
- 픽업 장소 선택
- 노쇼 처리

### 제외된 기능 (향후 개발)
- 앱 내 결제 게이트웨이
- 실시간 채팅
- 자동 송금 검증
- 배송/택배 지원

## 라이선스

ISC
