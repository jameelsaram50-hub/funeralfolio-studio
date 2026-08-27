class Memorial {
  final String id;
  final String? userId;
  final String name;
  final String? birthDate;
  final String? deathDate;
  final String? birthPlace;
  final String? serviceDate;
  final String? serviceLocation;
  final String? biography;
  final String? photoUrl;
  final String themeColor;
  final String format;
  final String status;
  final String? career;
  final String? survivors;
  final String? personalTraits;
  final String? quote;
  final String? themeId;
  final String? productId;
  final String? orderOfService;
  final String? prayerVerse;
  final String? pallbearers;
  final DateTime createdAt;

  Memorial({
    required this.id,
    this.userId,
    required this.name,
    this.birthDate,
    this.deathDate,
    this.birthPlace,
    this.serviceDate,
    this.serviceLocation,
    this.biography,
    this.photoUrl,
    this.themeColor = '#1e293b',
    this.format = 'Bi-fold Program',
    this.status = 'Active',
    this.career,
    this.survivors,
    this.personalTraits,
    this.quote,
    this.themeId = 'celestial-gold',
    this.productId = 'bifold-program',
    this.orderOfService,
    this.prayerVerse,
    this.pallbearers,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  Memorial copyWith({
    String? id,
    String? userId,
    String? name,
    String? birthDate,
    String? deathDate,
    String? birthPlace,
    String? serviceDate,
    String? serviceLocation,
    String? biography,
    String? photoUrl,
    String? themeColor,
    String? format,
    String? status,
    String? career,
    String? survivors,
    String? personalTraits,
    String? quote,
    String? themeId,
    String? productId,
    String? orderOfService,
    String? prayerVerse,
    String? pallbearers,
    DateTime? createdAt,
  }) {
    return Memorial(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      birthDate: birthDate ?? this.birthDate,
      deathDate: deathDate ?? this.deathDate,
      birthPlace: birthPlace ?? this.birthPlace,
      serviceDate: serviceDate ?? this.serviceDate,
      serviceLocation: serviceLocation ?? this.serviceLocation,
      biography: biography ?? this.biography,
      photoUrl: photoUrl ?? this.photoUrl,
      themeColor: themeColor ?? this.themeColor,
      format: format ?? this.format,
      status: status ?? this.status,
      career: career ?? this.career,
      survivors: survivors ?? this.survivors,
      personalTraits: personalTraits ?? this.personalTraits,
      quote: quote ?? this.quote,
      themeId: themeId ?? this.themeId,
      productId: productId ?? this.productId,
      orderOfService: orderOfService ?? this.orderOfService,
      prayerVerse: prayerVerse ?? this.prayerVerse,
      pallbearers: pallbearers ?? this.pallbearers,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  factory Memorial.fromJson(Map<String, dynamic> json) {
    return Memorial(
      id: json['id'] ?? '',
      userId: json['user_id'],
      name: json['name'] ?? 'Loved One',
      birthDate: json['birth_date'],
      deathDate: json['death_date'],
      birthPlace: json['birth_place'],
      serviceDate: json['service_date'],
      serviceLocation: json['service_location'],
      biography: json['biography'],
      photoUrl: json['photo_url'],
      themeColor: json['theme_color'] ?? '#1e293b',
      format: json['format'] ?? 'Bi-fold Program',
      status: json['status'] ?? 'Active',
      career: json['career'],
      survivors: json['survivors'],
      personalTraits: json['personal_traits'],
      quote: json['quote'],
      themeId: json['theme_id'] ?? 'celestial-gold',
      productId: json['product_id'] ?? 'bifold-program',
      orderOfService: json['order_of_service'],
      prayerVerse: json['prayer_verse'],
      pallbearers: json['pallbearers'],
      createdAt: json['created_at'] != null 
          ? DateTime.tryParse(json['created_at']) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      if (userId != null) 'user_id': userId,
      'name': name,
      if (birthDate != null) 'birth_date': birthDate,
      if (deathDate != null) 'death_date': deathDate,
      if (birthPlace != null) 'birth_place': birthPlace,
      if (serviceDate != null) 'service_date': serviceDate,
      if (serviceLocation != null) 'service_location': serviceLocation,
      if (biography != null) 'biography': biography,
      if (photoUrl != null) 'photo_url': photoUrl,
      'theme_color': themeColor,
      'format': format,
      'status': status,
      if (career != null) 'career': career,
      if (survivors != null) 'survivors': survivors,
      if (personalTraits != null) 'personal_traits': personalTraits,
      if (quote != null) 'quote': quote,
      if (themeId != null) 'theme_id': themeId,
      if (productId != null) 'product_id': productId,
      if (orderOfService != null) 'order_of_service': orderOfService,
      if (prayerVerse != null) 'prayer_verse': prayerVerse,
      if (pallbearers != null) 'pallbearers': pallbearers,
      'created_at': createdAt.toIso8601String(),
    };
  }
}

class Obituary {
  final String id;
  final String? memorialId;
  final String personName;
  final String tone;
  final String? faith;
  final String content;
  final bool isPublished;
  final DateTime createdAt;

  Obituary({
    required this.id,
    this.memorialId,
    required this.personName,
    required this.tone,
    this.faith,
    required this.content,
    this.isPublished = true,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  factory Obituary.fromJson(Map<String, dynamic> json) {
    return Obituary(
      id: json['id'] ?? '',
      memorialId: json['memorial_id'],
      personName: json['person_name'] ?? '',
      tone: json['tone'] ?? 'Heartfelt',
      faith: json['faith'],
      content: json['content'] ?? '',
      isPublished: json['is_published'] ?? true,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at']) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      if (memorialId != null) 'memorial_id': memorialId,
      'person_name': personName,
      'tone': tone,
      if (faith != null) 'faith': faith,
      'content': content,
      'is_published': isPublished,
      'created_at': createdAt.toIso8601String(),
    };
  }
}

class Condolence {
  final String id;
  final String memorialId;
  final String guestName;
  final String message;
  final String? relationship;
  final bool candleLit;
  final DateTime createdAt;

  Condolence({
    required this.id,
    required this.memorialId,
    required this.guestName,
    required this.message,
    this.relationship,
    this.candleLit = false,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  factory Condolence.fromJson(Map<String, dynamic> json) {
    return Condolence(
      id: json['id'] ?? '',
      memorialId: json['memorial_id'] ?? 'default',
      guestName: json['guest_name'] ?? 'A Caring Friend',
      message: json['message'] ?? '',
      relationship: json['relationship'],
      candleLit: json['candle_lit'] ?? false,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at']) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'memorial_id': memorialId,
      'guest_name': guestName,
      'message': message,
      if (relationship != null) 'relationship': relationship,
      'candle_lit': candleLit,
      'created_at': createdAt.toIso8601String(),
    };
  }
}

class Order {
  final String id;
  final String customerName;
  final String customerEmail;
  final String packageName;
  final double amount;
  final String status;
  final String? trackingNumber;
  final String? downloadUrl;
  final DateTime createdAt;

  Order({
    required this.id,
    required this.customerName,
    required this.customerEmail,
    required this.packageName,
    required this.amount,
    this.status = 'Paid',
    this.trackingNumber,
    this.downloadUrl,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] ?? '',
      customerName: json['customer_name'] ?? '',
      customerEmail: json['customer_email'] ?? '',
      packageName: json['package_name'] ?? '',
      amount: (json['amount'] is num) ? (json['amount'] as num).toDouble() : 0.0,
      status: json['status'] ?? 'Paid',
      trackingNumber: json['tracking_number'],
      downloadUrl: json['download_url'],
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at']) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'customer_name': customerName,
      'customer_email': customerEmail,
      'package_name': packageName,
      'amount': amount,
      'status': status,
      if (trackingNumber != null) 'tracking_number': trackingNumber,
      if (downloadUrl != null) 'download_url': downloadUrl,
      'created_at': createdAt.toIso8601String(),
    };
  }
}

class TemplateItem {
  final String id;
  final String title;
  final String category;
  final String tradition;
  final String description;
  final String imageUrl;
  final String dimensions;
  final double price;
  final String productType;
  final String defaultThemeId;

  const TemplateItem({
    required this.id,
    required this.title,
    required this.category,
    required this.tradition,
    required this.description,
    required this.imageUrl,
    required this.dimensions,
    this.price = 39.0,
    this.productType = 'bifold',
    this.defaultThemeId = 'celestial-gold',
  });
}
