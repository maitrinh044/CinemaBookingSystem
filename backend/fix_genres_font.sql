SET client_encoding = 'UTF8';
DELETE FROM genres WHERE id NOT IN (SELECT DISTINCT genre_id FROM movie_genres);
UPDATE genres SET name = 'Hành Động', description = 'Phim Hành Động' WHERE id = 3;
UPDATE genres SET name = 'Khoa Học Viễn Tưởng', description = 'Phim Khoa Học Viễn Tưởng' WHERE id = 4;
UPDATE genres SET name = 'Kinh Dị', description = 'Phim Kinh Dị' WHERE id = 5;
UPDATE genres SET name = 'Hoạt Hình', description = 'Phim Hoạt Hình' WHERE id = 6;
UPDATE genres SET name = 'Tình Cảm', description = 'Phim Tình Cảm' WHERE id = 7;
UPDATE genres SET name = 'Hài Hước', description = 'Phim Hài Hước' WHERE id = 8;
UPDATE genres SET name = 'Phiêu Lưu', description = 'Phim Phiêu Lưu' WHERE id = 9;
