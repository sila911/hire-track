public function up(): void
{
    Schema::create('applications', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('company');
        $table->string('role');
        $table->enum('status', ['Applied', 'Interviewing', 'Accepted', 'Rejected'])->default('Applied');
        $table->date('applied_at');
        $table->timestamps();
    });
}