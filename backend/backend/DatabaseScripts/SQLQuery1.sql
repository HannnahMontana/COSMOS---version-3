use cosmos;

go

CREATE OR ALTER PROCEDURE AddArticle
    @Title NVARCHAR(255),
    @Subtitle NVARCHAR(255),
    @Content NVARCHAR(MAX),
    @BannerUrl NVARCHAR(500),
    @UserId NVARCHAR(450)
AS
BEGIN
    INSERT INTO articles (title, subtitle, content, bannerUrl, userId, createdAt)
    VALUES (@Title, @Subtitle, @Content, @BannerUrl, @UserId, GETDATE());

    SELECT SCOPE_IDENTITY() AS ArticleId;
END;

go

CREATE OR ALTER FUNCTION GetArticleCountAboveAverageByUser(@UserId NVARCHAR(450))
RETURNS INT
AS
BEGIN
    RETURN (
        SELECT COUNT(*) 
        FROM articles
        WHERE UserId = @UserId
          AND LEN(Content) > (
              SELECT AVG(LEN(Content))
              FROM articles
          )
    );
END;

go

CREATE TRIGGER trg_UpdateArticleTimestamp
ON articles
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE a
    SET a.createdAt = GETDATE()
    FROM articles a
    INNER JOIN Inserted i ON a.id = i.id;
END;

go
