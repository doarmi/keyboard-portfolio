# Keyboard Portfolio

인터랙티브 키보드 포트폴리오의 기본 개발 뼈대입니다. 현재는 섹션 순서, Three.js 테스트 장면, GSAP/ScrollTrigger 등록, 키보드 입력 훅, 프로젝트 데이터 타입만 준비되어 있습니다.

## 실행

```bash
npm install
npm run dev
npm run build
```

## 구조

- `src/components`: 공용 최소 컴포넌트
- `src/sections`: 페이지 섹션
- `src/three`: Three.js 장면
- `src/hooks`: 키보드 입력 훅
- `src/data`: 프로젝트 데이터
- `src/styles`: 전역 스타일
- `public/assets`: 향후 이미지, 모델, 텍스처, scrub 소스

## 다음 작업 TODO

1. Pinterest 키보드 디자인 레퍼런스 수집
2. 레퍼런스 디자인 분석
3. 최종 디자인 시스템 결정
4. 실제 촬영 키보드 사진 선정
5. 이미지 원본 해상도 확인
6. 3D 키보드 모델 선정 또는 제작
7. Scroll Scrubbing 설계
8. 고해상도 Scrub 소스 제작
9. 실사 → 3D 전환 구현
10. Three.js 키보드 구현
11. 실제 키보드 입력 연동
12. 화면 키캡 클릭 연동
13. GSAP / ScrollTrigger 인터랙션
14. PROJECTS 구현
15. ABOUT 구현
16. SKILLS 구현
17. CONTACT 구현
18. 반응형
19. 해상도/선명도 검수
20. 성능 최적화
21. GitHub 연결
22. Vercel 배포
23. Production 환경 최종 검수
